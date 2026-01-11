import { motion } from "framer-motion";
import { useEffect } from "react";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service | Valid Panel";
  }, []);

  return (
    <section className="mx-auto px-5 py-40">
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 right-1/9 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Please read these terms carefully before using Valid Panel's services.
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
              <a href="#acceptance" className="text-primary hover:underline">
                Acceptance of Terms
              </a>
            </li>
            <li>
              <a href="#service" className="text-primary hover:underline">
                Description of Service
              </a>
            </li>
            <li>
              <a href="#accounts" className="text-primary hover:underline">
                User Accounts and Eligibility
              </a>
            </li>
            <li>
              <a href="#payment" className="text-primary hover:underline">
                Subscription and Payment Terms
              </a>
            </li>
            <li>
              <a href="#ip" className="text-primary hover:underline">
                Intellectual Property Rights
              </a>
            </li>
            <li>
              <a href="#conduct" className="text-primary hover:underline">
                User Conduct and Prohibited Activities
              </a>
            </li>
            <li>
              <a href="#fraud" className="text-primary hover:underline">
                Fraud Prevention and Data Usage
              </a>
            </li>
            <li>
              <a href="#data" className="text-primary hover:underline">
                Data Ownership and Customer Data
              </a>
            </li>
            <li>
              <a href="#termination" className="text-primary hover:underline">
                Termination and Suspension
              </a>
            </li>
            <li>
              <a href="#disclaimers" className="text-primary hover:underline">
                Disclaimers
              </a>
            </li>
            <li>
              <a href="#liability" className="text-primary hover:underline">
                Limitation of Liability
              </a>
            </li>
            <li>
              <a
                href="#indemnification"
                className="text-primary hover:underline"
              >
                Indemnification
              </a>
            </li>
            <li>
              <a href="#governing" className="text-primary hover:underline">
                Governing Law and Dispute Resolution
              </a>
            </li>
            <li>
              <a href="#changes" className="text-primary hover:underline">
                Changes to Terms
              </a>
            </li>
            <li>
              <a href="#severability" className="text-primary hover:underline">
                Severability
              </a>
            </li>
            <li>
              <a href="#agreement" className="text-primary hover:underline">
                Entire Agreement
              </a>
            </li>
            <li>
              <a href="#contact" className="text-primary hover:underline">
                Contact Information
              </a>
            </li>
          </ol>
        </div>

        <div className="space-y-8">
          <div id="acceptance">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing and using ValidPanel ("we," "us," or "our"), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service. These terms apply to all users, including
              individuals, businesses, and entities using our platform to create
              and manage social media stores and shops.
            </p>
          </div>

          <div id="service">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 mb-4">
              ValidPanel is a Software as a Service (SaaS) platform that enables
              users to create, manage, and operate social media stores and
              shops. Our services include, but are not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Store creation and customization tools</li>
              <li>Integration with social media platforms</li>
              <li>Payment processing and gateway management</li>
              <li>Order and inventory management</li>
              <li>Analytics and reporting</li>
              <li>Customer relationship management</li>
              <li>Subscription and billing management</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify, suspend, or discontinue any part
              of our services at any time without notice.
            </p>
          </div>

          <div id="accounts">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Accounts and Eligibility
            </h2>
            <p className="text-gray-700 mb-4">
              To use our services, you must create an account and provide
              accurate, complete, and current information. You are responsible
              for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You must be
              at least 18 years old or have parental consent to use our
              services.
            </p>
            <p className="text-gray-700 mb-4">
              You agree to notify us immediately of any unauthorized use of your
              account. We are not liable for any loss or damage arising from
              your failure to protect your account information.
            </p>
          </div>

          <div id="payment">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Subscription and Payment Terms
            </h2>
            <p className="text-gray-700 mb-4">
              Our services are offered on a subscription basis with various
              plans. Payment is due in advance and is non-refundable except as
              expressly stated in our refund policy. We use third-party payment
              processors, and you agree to comply with their terms.
            </p>
            <p className="text-gray-700 mb-4">
              We reserve the right to change pricing with 30 days' notice.
              Failure to pay may result in suspension or termination of
              services. All fees are exclusive of taxes, which you are
              responsible for.
            </p>
          </div>

          <div id="ip">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Intellectual Property Rights
            </h2>
            <p className="text-gray-700 mb-4">
              All content, features, and functionality of ValidPanel, including
              but not limited to software, designs, text, graphics, logos, and
              trademarks, are owned by us or our licensors and are protected by
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 mb-4">
              You retain ownership of content you create or upload to your
              stores. By using our platform, you grant us a limited license to
              use, store, and process your content to provide services.
            </p>
          </div>

          <div id="conduct">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. User Conduct and Prohibited Activities
            </h2>
            <p className="text-gray-700 mb-4">
              You agree not to use our services for any unlawful purpose or to
              violate any laws, regulations, or third-party rights. Prohibited
              activities include, but are not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>
                Creating stores for illegal, harmful, or offensive
                products/services
              </li>
              <li>
                Engaging in fraudulent, deceptive, or misleading practices
              </li>
              <li>Infringing on intellectual property rights</li>
              <li>Harassing, abusing, or harming others</li>
              <li>Uploading malicious code or viruses</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>
                Using automated tools to access our services without permission
              </li>
            </ul>
          </div>

          <div id="fraud">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Fraud Prevention and Data Usage
            </h2>
            <p className="text-gray-700 mb-4">
              We are committed to maintaining a secure platform and employ
              various measures to prevent fraudulent activities, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Transaction monitoring and risk assessment</li>
              <li>User identity verification</li>
              <li>Data analytics for anomaly detection</li>
              <li>
                Collaboration with payment processors and financial institutions
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              In case of suspected fraud, we may suspend or terminate accounts,
              block transactions, and share relevant information with law
              enforcement authorities or affected parties. We may also use user
              data, including personal information and transaction data, to
              detect and prevent fraud.
            </p>
            <p className="text-gray-700 mb-4">
              User data is collected, stored, and processed in accordance with
              our Privacy Policy. We use data to provide services, improve our
              platform, ensure security, and comply with legal obligations. We
              do not sell personal data to third parties for marketing purposes.
            </p>
          </div>

          <div id="data">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Data Ownership and Customer Data
            </h2>
            <p className="text-gray-700 mb-4">
              You retain ownership of all data related to your stores, including
              customer information, order data, and product listings. However,
              by using our platform, you acknowledge that we may access,
              process, and store this data to provide services.
            </p>
            <p className="text-gray-700 mb-4">
              We implement security measures to protect customer data, but you
              are ultimately responsible for complying with data protection laws
              applicable to your use of customer information.
            </p>
          </div>

          <div id="termination">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Termination and Suspension
            </h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to our
              services at our discretion, with or without cause, and with or
              without notice. Upon termination, your right to use the service
              ceases immediately, and we may delete your data after a reasonable
              period.
            </p>
            <p className="text-gray-700 mb-4">
              You may terminate your account at any time. Termination does not
              relieve you of obligations incurred prior to termination.
            </p>
          </div>

          <div id="disclaimers">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Disclaimers
            </h2>
            <p className="text-gray-700 mb-4">
              Our services are provided "as is" and "as available" without
              warranties of any kind, either express or implied, including but
              not limited to warranties of merchantability, fitness for a
              particular purpose, and non-infringement.
            </p>
            <p className="text-gray-700 mb-4">
              We do not guarantee that our services will be uninterrupted,
              error-free, or secure. We are not responsible for any damages
              caused by third-party integrations or actions.
            </p>
          </div>

          <div id="liability">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              In no event shall ValidPanel, its directors, employees, or agents
              be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or in connection with your use of
              our services, even if we have been advised of the possibility of
              such damages.
            </p>
            <p className="text-gray-700 mb-4">
              Our total liability for any claim related to our services shall
              not exceed the amount paid by you for the services in the 12
              months preceding the claim.
            </p>
          </div>

          <div id="indemnification">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Indemnification
            </h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold harmless ValidPanel and its
              affiliates from any claims, damages, losses, or expenses arising
              from your use of our services, violation of these terms, or
              infringement of any rights of another party.
            </p>
          </div>

          <div id="governing">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-700 mb-4">
              These terms are governed by the laws of [Your Jurisdiction],
              without regard to conflict of law principles. Any disputes arising
              from these terms or your use of our services shall be resolved
              through binding arbitration in [Your Jurisdiction].
            </p>
          </div>

          <div id="changes">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Changes to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these terms at any time. We will
              notify users of material changes via email or platform
              notification. Continued use of our services after changes
              constitutes acceptance of the new terms.
            </p>
          </div>

          <div id="severability">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. Severability
            </h2>
            <p className="text-gray-700 mb-4">
              If any provision of these terms is found to be unenforceable, the
              remaining provisions shall remain in full force and effect.
            </p>
          </div>

          <div id="agreement">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              16. Entire Agreement
            </h2>
            <p className="text-gray-700 mb-4">
              These terms constitute the entire agreement between you and
              ValidPanel regarding the use of our services and supersede all
              prior agreements.
            </p>
          </div>

          <div id="contact">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              17. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please
              contact us at legal@validpanel.com or through our support
              channels.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TermsOfService;
