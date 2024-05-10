const exec = require("child_process").exec;

function createServer(domain, res) {
  // Generate BIND zone file configuration
  const zoneConfig = `
  zone "${domain}" {
    type master;
    file "/etc/bind/zones/${domain}.zone";
    allow-update { none; };
    notify yes;
  };
  `;

  // Write zone file configuration to a temporary file
  // Execute BIND reload/restart command
  exec(
    `echo "${zoneConfig}" > /tmp/${domain}.conf && sudo mv /tmp/${domain}.conf /etc/bind/named.conf.local && sudo systemctl reload bind9`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      createARecord(domain, "5.196.190.226");
      console.log(`Zone ${domain} created successfully`);
      res.json({ message: "Zone created successfully" });
    }
  );
}

function createARecord(domain, ipAddress) {
  const zoneFileContent = `$TTL 1D
  @ IN SOA ns.${domain} admin.${domain} (
      2022051101 ; Serial
      3H ; Refresh
      15M ; Retry
      1W ; Expire
      1D ; Minimum TTL
  )
  
  @ IN A ${ipAddress}
  www IN A ${ipAddress}
  `;

  exec(
    `echo "${zoneFileContent}" > /etc/bind/zones/${domain}.zone && sudo systemctl reload bind9`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`A record for ${domain} created successfully`);
    }
  );
}

module.exports = { createServer };
