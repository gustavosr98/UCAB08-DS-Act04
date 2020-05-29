import Stripe from 'stripe';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    database: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
  },
  paymentProvider: {
    stripe: {
      secretKey: <string>process.env.STRIPE_SECRET_KEY,
      publicKey: <string>process.env.STRIPE_PUBLIC_KEY,
      config: <Stripe.StripeConfig>{
        apiVersion: process.env.STRIPE_API_VERSION,
      },
    },
  },
  lang: {
    poeditor: {
      apiSecretKey: process.env.POEDITOR_API_KEY,
      projectId: process.env.POEDITOR_PROJECT_ID,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    name: process.env.JWT_NAME,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  mails: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      emailFrom: process.env.SENDGRID_FROM,
      templates: {
        welcome: process.env.SENDGRID_WELCOME_TEMPLATE,
        invoiceEn: process.env.SENDGRID_WELCOME_INVOICE_EN_TEMPLATE,
        invoiceEs: process.env.SENDGRID_WELCOME_INVOICE_ES_TEMPLATE,
      },
    },
  },
});
