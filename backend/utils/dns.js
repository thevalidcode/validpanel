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

        // After successfully reloading BIND, create A record
        createARecord(domain, "5.196.190.226");

        console.log(`Zone ${domain} created successfully`);
        res.json({ message: "Zone created successfully" });
      });
    });
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

${domain} IN A ${ipAddress}
www.${domain} IN A ${ipAddress}
`;

  // Write zone file content to /var/lib/bind/{domain}.hosts
  fs.writeFile(`/var/lib/bind/${domain}.hosts`, zoneFileContent, (err) => {
    if (err) {
      console.error(`Error writing zone file: ${err.message}`);
      return;
    }

    // Execute BIND reload command
    exec("systemctl reload bind9", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error reloading BIND: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`A record for ${domain} created successfully`);
    });
  });
}
module.exports = { createServer };
