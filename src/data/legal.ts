export interface LegalSection {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
}

export interface LegalPageContent {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: readonly string[];
  sections: readonly LegalSection[];
}

export const termsContent: LegalPageContent = {
  slug: 'terms-and-conditions',
  title: 'Terms and Conditions',
  seoTitle: 'Terms and Conditions | National Filing Corporation',
  description: 'Terms and conditions governing the use of the National Filing Corporation website and filing services.',
  intro: [
    'These terms and conditions govern your use of this website. By using this website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of them, you must not use this website.',
    'By using this website and agreeing to these terms and conditions, you represent that you are at least 18 years of age.',
    'This website uses cookies. By using this website, you consent to our use of cookies in accordance with our cookie practices.',
  ],
  sections: [
    {
      heading: 'License to Use Website',
      paragraphs: [
        'Unless otherwise stated, the website and/or its licensors own the intellectual property rights in the website and its material. Subject to the license below, all these intellectual property rights are reserved.',
        'You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out in these terms and conditions.',
        'Where content is specifically made available for redistribution, it may only be redistributed within your organization.',
      ],
      bullets: [
        'Republish material from this website, including republication on another website.',
        'Sell, rent, or sublicense material from the website.',
        'Show any material from the website in public.',
        'Reproduce, duplicate, copy, or otherwise exploit website material for a commercial purpose.',
        'Edit or otherwise modify any material on the website.',
        'Redistribute material except where it is expressly made available for redistribution.',
      ],
    },
    {
      heading: 'Acceptable Use',
      paragraphs: [
        'The purpose of this website is to help business owners and their authorized agents file corporate and other government-related documents. By using it, you represent that you own or lawfully represent the business for which you seek services, that the information you provide is correct, and that the business is lawful.',
        'You must not use this website in a way that causes damage, impairs its availability or accessibility, is unlawful, illegal, fraudulent, or harmful, or is connected with any unlawful, illegal, fraudulent, or harmful purpose or activity.',
        'You must not conduct systematic or automated data collection activities—including scraping, data mining, data extraction, or data harvesting—on or in relation to this website without express written consent. You must not use this website to transmit unsolicited commercial communications.',
      ],
    },
    {
      heading: 'User Content and Communications',
      paragraphs: [
        '“Your user content” means material that you submit to this website for any purpose, including text, images, audio, video, and audiovisual material.',
        'By submitting information through the website, you agree that the website owner and its affiliates may contact you by phone, SMS/MMS or text message, email, and postal mail using the information you submit. You may withdraw that agreement at any time.',
        'By using the website’s services, you appoint the website as your designated renewal service with the state in which your company is registered or incorporated, authorized to receive notifications on your behalf regarding future renewals and related matters.',
        'You are solely responsible for content you upload through the website.',
      ],
    },
    {
      heading: 'Cancellation and Refund Policy',
      paragraphs: [
        'All cancellation or refund requests must be submitted by email to info@nationalfilingcorporation.com. We cannot accept cancellation or refund requests through other channels.',
        'Include the last four digits of the credit card used for the purchase, the telephone number submitted with the application, the cardholder name, and the business address.',
        'If you are dissatisfied with our services, call (768) 475-2846 between 9:00 AM and 6:00 PM Eastern Time, Monday through Friday. Our team will work with you to understand and resolve the issue.',
      ],
    },
    {
      heading: 'Chargeback Policy',
      paragraphs: [
        'Some customers direct their card issuer to reverse a charge without first contacting us. This is known as a chargeback and can harm a company’s standing with its payment processors. Our policy is to reach out and invite dissatisfied customers to resolve their concerns directly. When a customer makes no legitimate attempt to resolve a dispute or abuses the chargeback process, the account may be transferred for collection and legal recovery as permitted by law.',
      ],
    },
    {
      heading: 'Law and Dispute Resolution',
      paragraphs: [
        'This agreement is governed by the laws of Florida. The parties agree to resolve disputes related to this agreement through binding arbitration in Miami-Dade County, Florida. The prevailing party may recover costs and reasonable attorney fees. A judgment or settlement may be enforced through remedies available under applicable law.',
      ],
    },
    {
      heading: 'Changes to These Terms',
      paragraphs: [
        'We may modify these terms from time to time. When changes are made, the revised version will be posted on this page. You should revisit these terms regularly. Continued use of the website after a modification is posted indicates acceptance of the revised terms.',
      ],
    },
    {
      heading: 'No Warranties',
      paragraphs: [
        'This website is provided “as is” without representations or warranties, express or implied. National Filing Corporation makes no representations or warranties regarding the website or the information and materials provided through it.',
        'To the extent permitted by law, National Filing Corporation is not responsible for indirect, special, consequential, or business losses, including loss of revenue, income, profits, savings, contracts, relationships, reputation, goodwill, corporate protections, information, or data. These limitations apply even if the possibility of loss has been communicated.',
      ],
    },
    {
      heading: 'Indemnity',
      paragraphs: [
        'You agree to indemnify the website owner and its affiliates against losses, damages, costs, liabilities, and expenses—including reasonable legal expenses—arising from your breach of these terms or a claim that you have breached them.',
      ],
    },
    {
      heading: 'Severability',
      paragraphs: [
        'If any provision of this agreement is found invalid or unenforceable, the remaining provisions remain in full force and effect.',
      ],
    },
    {
      heading: 'Entire Agreement',
      paragraphs: [
        'This agreement constitutes the entire agreement between the parties regarding its subject matter. Prior understandings or representations are not binding except to the extent incorporated here.',
      ],
    },
  ],
};

export const privacyContent: LegalPageContent = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  seoTitle: 'Privacy Policy | National Filing Corporation',
  description: 'National Filing Corporation website privacy, acceptable-use, liability, copyright, and third-party link terms.',
  intro: [
    'This policy explains the rules that apply when you access and use the National Filing Corporation website and its content.',
  ],
  sections: [
    {
      heading: 'Limitation on Usage',
      paragraphs: ['National Filing Corporation may limit or terminate your access to this website at any time without notice.'],
    },
    {
      heading: 'Visitor Online Conduct',
      paragraphs: ['You are responsible for your actions on the website and must comply with applicable laws and regulations.'],
      bullets: [
        'Use the website only for lawful and intended purposes.',
        'Do not disrupt the website or compromise its security.',
        'Do not interfere with another visitor’s use of the website.',
        'Do not attempt to access restricted areas of the website.',
        'National Filing Corporation may prohibit inappropriate conduct on the website.',
      ],
    },
    {
      heading: 'Web Links',
      paragraphs: ['Links to third-party websites are provided for informational purposes only. National Filing Corporation does not endorse their content. Unauthorized use of our logo, trademarks, or copyrighted material in links is prohibited.'],
    },
    {
      heading: 'Digital Millennium Copyright Act',
      paragraphs: ['You may not distribute content protected by copyright or other proprietary rights without authorization. Copyright infringement notices may be sent to info@nationalfilingcorporation.com.'],
    },
    {
      heading: 'As-Is and As-Available',
      paragraphs: ['This website is provided “as is” and “as available.” National Filing Corporation makes no express or implied warranty concerning its operation or content. Use is at your own risk, and availability, accuracy, reliability, and currentness are not guaranteed.'],
    },
    {
      heading: 'Limitation of Liability',
      paragraphs: ['To the extent permitted by law, National Filing Corporation is not liable for damages arising from the use of this website or third-party websites, including compensatory, punitive, direct, indirect, incidental, consequential, special, or similar damages.'],
    },
    {
      heading: 'Indemnity',
      paragraphs: ['You agree to indemnify National Filing Corporation for damages, losses, costs, or expenses incurred because of your use of the website or its content, goods, and services.'],
    },
    {
      heading: 'Severability',
      paragraphs: ['If any provision of these terms is held invalid or unenforceable, the remaining provisions remain valid.'],
    },
    {
      heading: 'Integration Clause',
      paragraphs: ['These terms of use, including referenced documents, represent the entire understanding between you and National Filing Corporation concerning your use of this website and its content, products, and services.'],
    },
  ],
};
