# Spent

Personal spend tracking app:

- upload bank and credit card files
- convenient filtering, sorting
- conventient categorisation, recategorisation
- auto categorisation rules
- export csv

Aims to support uploads from:

- American Express AU (detailed format)
- CBA bank accounts
- CBA Mastercard

# Run this up in a codespace

The easiest way to get this up and running is to use the pre-configured codespace

- set up a new firebase project
  - todo: brreak this down, especially the auth part
- set up your environment
  - copy .env.example to .env
  - go to firebase console > project overview > gear icon > project settings
  - scroll down to "your apps" .. you'll see your values there
  - apply these (without quotes) to your .env file
- connect / authorise your project
  - in the terminal run `npx firebase login`
  - cmd-click or ctrl-click the link it creates for you
  - follow the prompts, press the two blue confirmation buttons and the "copy" button
  - paste that code back into the terminal window
- in the root directory, run `npm run local`
