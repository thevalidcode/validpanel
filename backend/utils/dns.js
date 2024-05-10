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
module.exports = { createServer };
