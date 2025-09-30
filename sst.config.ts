/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'pack-mate',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const secrets = {
      dbUsername: new sst.Secret('DatabaseUsername'),
      dbPassword: new sst.Secret('DatabasePassword'),
      dbName: new sst.Secret('DatabaseName'),
      googleClientId: new sst.Secret('GoogleClientId'),
      googleClientSecret: new sst.Secret('GoogleClientSecret'),
      nextAuthSecret: new sst.Secret('NextAuthSecret'),
      nextAuthUrl: new sst.Secret('NextAuthUrl'),
    };
    // Create PostgreSQL database

    const vpc = new sst.aws.Vpc('Vpc', {
      // nat: 'managed',
      bastion: true,
      nat: {
        type: 'ec2',
        ec2: {
          instance: 't4g.micro',
        },
      },
    });
    const postgres = new sst.aws.Postgres('Database', {
      database: secrets.dbName.value,
      username: secrets.dbUsername.value,
      password: secrets.dbPassword.value,
      vpc: vpc,
    });

    // Create Next.js app
    const site = new sst.aws.Nextjs('MyWeb', {
      path: '.',
      environment: {
        DATABASE_URL: $concat(
          'postgresql://',
          secrets.dbUsername.value,
          ':',
          secrets.dbPassword.value,
          '@',
          postgres.host,
          ':',
          postgres.port,
          '/',
          secrets.dbName.value
        ),
        GOOGLE_CLIENT_ID: secrets.googleClientId.value,
        GOOGLE_CLIENT_SECRET: secrets.googleClientSecret.value,
        NEXTAUTH_SECRET: secrets.nextAuthSecret.value,
        NEXTAUTH_URL: secrets.nextAuthUrl.value,
        NODE_ENV: 'production',
      },
      link: [postgres],
      transform: {
        server: {
          vpc: vpc,
        },
      },
      
    });

    console.log(
      'this is the url',
      postgres.host,
      postgres.port
    );

    return {
      postgres,
      site,
    };
  },
});
