const { exec } = require("child_process");
const fs = require("fs").promises;
const {db} = require("../db"); // Adjust the path to your db module

async function createServer(domain, panelId, res) {
  try {
    // Read existing content of named.conf.local
    let data = await fs.readFile("/etc/bind/named.conf.local", "utf8");

    // Append zoneConfig to the existing content
    const updatedContent = `${data}
zone "${domain}" {
  type master;
  file "/var/lib/bind/${domain}.hosts";
};`;

    if (domain.includes(".validpanel.com")) {
      await createARecord(domain, "5.196.190.226");
      await createVirtualHost(domain);
      await createSSL();
      res.json({ message: "Created successfully" });
    } else {
      // Write updated content back to named.conf.local
      await fs.writeFile("/etc/bind/named.conf.local", updatedContent);

      // Execute BIND reload command
      await execPromise("systemctl reload bind9");
      await createARecord(domain, "5.196.190.226");
      await createVirtualHost(domain);
      res.json({
        panelId: panelId,
        message: "Server created successfully",
      });
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createARecord(domain, ipAddress) {
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

  try {
    if (domain.includes(".validpanel.com")) {
      let data = await fs.readFile(
        "/var/lib/bind/validpanel.com.hosts",
        "utf8"
      );
      const updatedContent = `${data}
${domain}. IN A ${ipAddress}
www.${domain}. IN A ${ipAddress}`;
      await fs.writeFile("/var/lib/bind/validpanel.com.hosts", updatedContent);
      await execPromise("systemctl reload bind9");
    } else {
      await fs.writeFile(`/var/lib/bind/${domain}.hosts`, zoneFileContent);
      await execPromise("systemctl reload bind9");
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

async function createVirtualHost(domain) {
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

  try {
    await fs.writeFile(
      `/etc/apache2/sites-available/${domain}.conf`,
      fileContent
    );
    await execPromise(`a2ensite ${domain}.conf`);
    await execPromise("systemctl restart apache2");
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Error in command output: ${stderr}`);
        return reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
}

async function createSSL() {
  try {
    const registeredPanelsSnap = await db
      .collection("registeredPanels")
      .where("ssl", "==", false)
      .get();

    for (const regPanel of registeredPanelsSnap.docs) {
      await new Promise((resolve, reject) => {
        exec(`certbot --apache --redirect -d ${regPanel.id}`, (error) => {
          if (error) {
            console.error(`Error running certbot: ${error.message}`);
            return reject(error);
          }
          resolve();
        });
      });

      const filePath = `/etc/apache2/sites-enabled/${regPanel.id}-le-ssl.conf`;
      await ensureFileAvailable(filePath);

      try {
        const data = await fs.readFile(filePath, "utf8");

        const paragraphs = data.split(/\n\s*\n/);
        const newParagraphContent = `
ProxyPreserveHost On
ProxyPass /api/v2 https://${regPanel.id}:3001/api/v2
ProxyPassReverse /api/v2 https://${regPanel.id}:3001/api/v2`;
        const indexToInsert = paragraphs.length - 3;
        paragraphs.splice(indexToInsert, 0, newParagraphContent);

        const newData = paragraphs.join("\n\n");
        await fs.writeFile(filePath, newData, "utf8");

        await new Promise((resolve, reject) => {
          exec(`systemctl reload apache2`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error reloading apache2: ${error.message}`);
              return reject(error);
            }
            if (stderr) {
              console.error(`Error reloading apache2: ${stderr}`);
              return reject(new Error(stderr));
            }
            resolve();
          });
        });

        await db
          .collection("registeredPanels")
          .doc(regPanel.id)
          .update({ ssl: true });
        console.log(`SSL created for ${regPanel.id}`);
      } catch (err) {
        console.error(`Error processing file: ${err.message}`);
      }
    }
  } catch (error) {
    console.error(`Error in createSSL: ${error.message}`);
  }
}

async function ensureFileAvailable(filePath, retries = 10, delay = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.access(filePath);
      return;
    } catch (err) {
      if (i === retries - 1) {
        throw new Error(`File not found: ${filePath}`);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = { createServer, createSSL };
