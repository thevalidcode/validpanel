const fs = require("fs");
const exec = require("child_process").exec;
const { db } = require("../db");

function createServer(domain, panelId, res) {
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
          res.json({
            panelId: panelId,
            message: "Server created successfully",
          });
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
      const updatedContent =
        data +
        `${domain}. IN A ${ipAddress}
www.${domain}. IN A ${ipAddress}
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
      exec(
        `a2ensite /etc/apache2/sites-available/${domain}.conf`,
        (error, stdout, stderr) => {
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
        }
      );
    }
  );
}

async function createSSL() {
  const registeredPanelsCol = db
    .collection("registeredPanels")
    .where("ssl", "==", false);
  const registeredPanelsSnap = await registeredPanelsCol.get();
  for (const regPanel of registeredPanelsSnap.docs) {
    exec(`certbot --apache -d ${regPanel.id}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating ssl: ${error.message}`);
        return;
      } else if (stderr) {
        console.error(`Error creating ssl: ${stderr}`);
        return;
      } else {
        fs.readFile(
          `etc/apache2/sites-available/${regPanel.id}-le-ssl.conf`,
          "utf8",
          (err, data) => {
            if (err) {
              console.error(`Error reading file: ${err.message}`);
              res.status(500).json({ error: "Internal server error" });
              return;
            }
            const paragraphs = data.split(/\n\s*\n/);

            const indexToInsert = paragraphs.length - 3;

            const newParagraphContent = `
ProxyPreserveHost On
ProxyPass /api/v2 https://${regPanel.id}:3001/api/v2
ProxyPassReverse /api/v2 https://${regPanel.id}:3001/api/v2`;
            paragraphs.splice(indexToInsert, 0, newParagraphContent);

            const newData = paragraphs.join("\n\n");

            fs.writeFile(
              `etc/apache2/sites-available/${regPanel.id}-le-ssl.conf`,
              newData,
              "utf8",
              (err) => {
                if (err) {
                  console.error("Error writing file:", err);
                  return;
                }
              }
            );
          }
        );
        exec(
          `ln -s /etc/apache2/sites-available/${regPanel.id}-le-ssl.conf /etc/apache2/sites-enabled/${regPanel.id}-le-ssl.conf`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error linking ssl file: ${error.message}`);
              return;
            } else if (stderr) {
              console.error(`Error linking ssl file: ${stderr}`);
              return;
            }
          }
        );
      }
    });
    exec(`systemctl reload apache2`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error reloading apache2: ${error.message}`);
        return;
      } else if (stderr) {
        console.error(`Error reloading apache2: ${stderr}`);
        return;
      }
    });
    await db.collection("registeredPanels").doc(regPanel.id).update({
      ssl: true,
    });
  }
}
module.exports = { createServer, createSSL };
