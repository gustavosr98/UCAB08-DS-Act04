# PetroMiles

<p align="center">
  <img 
  alt="PetroMiles Round Logo"
  width="192" src="petromiles-frontend/public/img/icons/android-chrome-192x192.png">
</p>

![node version](https://img.shields.io/badge/node-12.16.3-blue)
![postgresql version](https://img.shields.io/badge/postgresql-12.2-blue)

![vue version](https://img.shields.io/badge/vue-2.6.11-blue)
![vuex version](https://img.shields.io/badge/vuex-3.1.3-blue)
![vue-router version](https://img.shields.io/badge/vue--router-3.1.6-blue)
![vuetify version](https://img.shields.io/badge/vue-2.2.11-blue)

![nest version](https://img.shields.io/badge/nest-7.0.0-blue)
![stripe version](https://img.shields.io/badge/stripe-8.49.0-blue)
![class-validator version](https://img.shields.io/badge/class--validator-0.12.2-blue)
![typeorm version](https://img.shields.io/badge/typeorm-0.2.24-blue)

## Intro

PetroMiles is a web-based customer loyalty platform built to earn, exchage and manage petro points. It provides customers american bank accounts as its main payment method.

Its written with [Vue](https://vuejs.org/) at the client side and [Nest](https://nestjs.com/) on the server side. It also integrates with [Stripe](https://stripe.com/) as its main payment provider.

Our web app can be found at https://petromiles-frontend.herokuapp.com/ while our production API base url can be found at https://petromiles-frontend.herokuapp.com/api/v1

## Prueba E2E relacionada con el retito de puntos

1. Descarga el driver siguiente para que la prueba pueda correr en Firefox: ![geckodriver](https://github.com/mozilla/geckodriver/releases/tag/v0.25.0)

2. Ejecuta los siguientes formatos

```bash
cd petromiles-frontend/ # Move to frontend project directory
npm install # Install dependencies
npm run test:e2e # Run the test
```
