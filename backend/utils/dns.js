const fs = require("fs");
const exec = require("child_process").exec;

function createServer(domain, res) {
  // Read existing content of named.conf.local
  fs.readFile("/etc/bind/named.conf.local", "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading named.conf.local: ${err.message}`);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Append zoneConfig to the existing content
    const updatedContent =
      data +
      `
  zone "${domain}" {
    type master;
    file "/var/lib/bind/${domain}.hosts";
  };
`;
    if (domain.includes(".validpanel.com")) {
      createARecord(domain, "5.196.190.226");
      res.json({ message: "Created successfully" });
    } else {
      // Write updated content back to named.conf.local
      fs.writeFile("/etc/bind/named.conf.local", updatedContent, (err) => {
        if (err) {
          console.error(`Error writing named.conf.local: ${err.message}`);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        // Execute BIND reload command
        exec("systemctl reload bind9", (error, stdout, stderr) => {
          if (error) {
            console.error(`Error reloading BIND: ${error.message}`);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          if (stderr) {
            console.error(`Error reloading BIND: ${stderr}`);
            res.status(500).json({ error: "Internal server error" });
            return;
          }
          createARecord(domain, "5.196.190.226");
          createVirtualHost(domain);
          createSSL(domain)
          res.json({ message: "Zone created successfully" });
        });
      });
    }
  });
}

function createARecord(domain, ipAddress) {
  const zoneFileContent = `$TTL 3600
@ IN SOA ${domain} admin.${domain} (
  2024042800
  3600
  600
  1209600
  3600 )

@ IN A ${ipAddress}
www IN A ${ipAddress}
`;
  if (domain.includes(".validpanel.com")) {
    fs.readFile("/var/lib/bind/validpanel.com.hosts", "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading validpanel.com.hosts: ${err.message}`);
        return;
      }
      const domainValue = domain.replace(/\.validpanel\.com$/, "");
      const updatedContent =
        data +
        `
    ${domainValue} IN A ${ipAddress}
    www.${domainValue} IN A ${ipAddress}
`;
      fs.writeFile(
        `/var/lib/bind/validpanel.com.hosts`,
        updatedContent,
        (err) => {
          if (err) {
            console.error(`Error writing zone file: ${err.message}`);
            return;
          }
          exec("systemctl reload bind9", (error, stdout, stderr) => {
            if (error) {
              console.error(`Error reloading BIND: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Stderr: ${stderr}`);
              return;
            }
          });
        }
      );
    });
  } else {
    fs.writeFile(`/var/lib/bind/${domain}.hosts`, zoneFileContent, (err) => {
      if (err) {
        console.error(`Error writing zone file: ${err.message}`);
        return;
      }
      exec("systemctl reload bind9", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error reloading BIND: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
      });
    });
  }
}

function createVirtualHost(domain) {
  const fileContent = `<VirtualHost *:80>
  DocumentRoot /var/www/panels
  ServerName ${domain}
  ServerAlias www.${domain}
  <Directory /var/www/panels>
      Options Indexes FollowSymLinks
      AllowOverride All
      Require all granted
  </Directory>
  RewriteEngine on
  RewriteCond %{SERVER_NAME} =www.${domain} [OR]
  RewriteCond %{SERVER_NAME} =${domain}
  RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
`;
  fs.writeFile(
    `/etc/apache2/sites-available/${domain}.conf`,
    fileContent,
    (err) => {
      if (err) {
        console.error(`Error writing zone file: ${err.message}`);
        return;
      }
      // Enable the site
      exec(`a2ensite ${domain}.conf`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error enabling site: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Error enabling site: ${stderr}`);
          return;
        }
        exec("systemctl restart apache2", (error, stdout, stderr) => {
          if (error) {
            console.error(`Error restarting Apache: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`Error restarting Apache: ${stderr}`);
            return;
          }
        });
      });
    }
  );
}

function createSSL(domain) {
  exec(`certbot --apache -d ${domain}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating ssl: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error creating ssl: ${stderr}`);
      return;
    }
  });
}
module.exports = { createServer };
