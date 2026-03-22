import { motion } from "framer-motion";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | ValidPanel";
  }, []);

  return (
    <section className="relative mx-auto px-5 py-40 min-h-screen">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: January 11, 2026
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-5 py-10"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Table of Contents
          </h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            <li>
              <a href="#collect" className="text-primary hover:underline">
                Information We Collect
              </a>
            </li>
            <li>
              <a href="#use" className="text-primary hover:underline">
                How We Use Your Information
              </a>
            </li>
            <li>
              <a href="#share" className="text-primary hover:underline">
                Information Sharing and Disclosure
              </a>
            </li>
            <li>
              <a href="#security" className="text-primary hover:underline">
                Data Security
              </a>
            </li>
            <li>
              <a href="#cookies" className="text-primary hover:underline">
                Cookies and Tracking Technologies
              </a>
            </li>
            <li>
              <a href="#retention" className="text-primary hover:underline">
                Data Retention
              </a>
            </li>
            <li>
              <a href="#rights" className="text-primary hover:underline">
                Your Rights and Choices
              </a>
            </li>
            <li>
              <a href="#transfers" className="text-primary hover:underline">
                International Data Transfers
              </a>
            </li>
            <li>
              <a href="#third" className="text-primary hover:underline">
                Third-Party Services
              </a>
            </li>
            <li>
              <a href="#children" className="text-primary hover:underline">
                Children's Privacy
              </a>
            </li>
            <li>
              <a href="#changes" className="text-primary hover:underline">
                Changes to This Privacy Policy
              </a>
            </li>
            <li>
              <a href="#contact" className="text-primary hover:underline">
                Contact Us
              </a>
            </li>
          </ol>
        </div>

        <div className="space-y-8">
          <div id="collect">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly when you create an
              account, make a purchase, contact us, or use our services. This
              includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                Personal information: name, email address, phone number, billing
                address
              </li>
              <li>Account credentials and profile information</li>
              <li>Payment information (processed by third-party providers)</li>
              <li>
                Store-related data: product listings, customer information,
                order details
              </li>
              <li>Communications with us</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We also automatically collect certain information when you use our
              platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Usage data: pages visited, features used, time spent</li>
              <li>
                Device information: IP address, browser type, operating system
              </li>
              <li>Cookies and tracking technologies</li>
              <li>Log data: access times, referring URLs</li>
            </ul>
          </div>

          <div id="use">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>To provide, maintain, and improve our services</li>
              <li>To process payments and manage subscriptions</li>
              <li>
                To communicate with you about your account and our services
              </li>
              <li>
                To personalize your experience and provide customer support
              </li>
              <li>To analyze usage patterns and improve our platform</li>
              <li>To ensure security and prevent fraud</li>
              <li>To comply with legal obligations</li>
              <li>To send marketing communications (with your consent)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              For stores you create on our platform, we use customer data to
              process orders, manage payments, and provide analytics. This data
              is used solely for store operations and is not shared for
              marketing purposes without your explicit consent.
            </p>
          </div>

          <div id="share">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information to third
              parties for marketing purposes. We may share your information in
              the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                With service providers who help us operate our platform (e.g.,
                payment processors, hosting providers)
              </li>
              <li>To comply with legal obligations or court orders</li>
              <li>
                To protect our rights, property, or safety, or that of our users
              </li>
              <li>In connection with a business transfer or acquisition</li>
              <li>With your consent</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Customer data from your stores is not shared with third parties
              except as necessary for payment processing or as required by law.
              You are responsible for obtaining consent from your customers for
              data collection and use.
            </p>
          </div>

          <div id="security">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to
              protect your information against unauthorized access, alteration,
              disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and employee training</li>
              <li>Secure data centers and infrastructure</li>
            </ul>
            <p className="text-gray-700 mb-4">
              However, no method of transmission over the internet or electronic
              storage is 100% secure. We cannot guarantee absolute security but
              are committed to protecting your data.
            </p>
          </div>

          <div id="cookies">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies, web beacons, and similar technologies to enhance
              your experience, analyze usage, and provide personalized content.
              Types of cookies we use:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Essential cookies: necessary for platform functionality</li>
              <li>Analytics cookies: to understand how you use our services</li>
              <li>Marketing cookies: to show relevant advertisements</li>
              <li>Preference cookies: to remember your settings</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can control cookie settings through your browser preferences.
              Disabling cookies may affect platform functionality.
            </p>
          </div>

          <div id="retention">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to provide our
              services, comply with legal obligations, resolve disputes, and
              enforce our agreements. Specific retention periods vary by data
              type:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                Account data: retained while your account is active and for a
                reasonable period after closure
              </li>
              <li>
                Payment data: retained as required for tax and accounting
                purposes
              </li>
              <li>Usage logs: typically retained for 12-24 months</li>
              <li>
                Marketing data: retained until you unsubscribe or request
                deletion
              </li>
            </ul>
          </div>

          <div id="rights">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Access: request a copy of your personal data</li>
              <li>Correction: update inaccurate or incomplete data</li>
              <li>Deletion: request deletion of your personal data</li>
              <li>Portability: receive your data in a structured format</li>
              <li>Restriction: limit how we process your data</li>
              <li>Objection: object to certain processing activities</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, contact us at privacy@validpanel.com. We
              will respond to requests within 30 days. Note that some rights may
              not apply in all circumstances, and we may need to retain certain
              data for legal or legitimate business purposes.
            </p>
          </div>

          <div id="transfers">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. International Data Transfers
            </h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              for international transfers, such as standard contractual clauses
              or adequacy decisions.
            </p>
          </div>

          <div id="third">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              Our platform integrates with third-party services (e.g., social
              media platforms, payment gateways). This Privacy Policy does not
              apply to these third parties. We encourage you to review their
              privacy policies.
            </p>
          </div>

          <div id="children">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 mb-4">
              Our services are not intended for children under 13 (or the
              applicable age in your jurisdiction). We do not knowingly collect
              personal information from children under this age. If we become
              aware of such collection, we will delete the information promptly.
            </p>
          </div>

          <div id="changes">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically to reflect changes
              in our practices or legal requirements. We will notify you of
              material changes via email, platform notification, or a prominent
              notice on our website. Your continued use of our services after
              changes take effect constitutes acceptance of the updated policy.
            </p>
          </div>

          <div id="contact">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Email: privacy@validpanel.com</li>
              {/* <li>Address: [Your Business Address]</li>
              <li>Phone: [Your Phone Number]</li> */}
            </ul>
            <p className="text-gray-700 mb-4">
              We are committed to addressing your privacy concerns and will work
              to resolve any issues promptly.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PrivacyPolicy;
