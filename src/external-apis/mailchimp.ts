const mailchimp = require('@mailchimp/mailchimp_marketing')

const { MAILCHIMP_LIST_ID, MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX } = process.env

if (!MAILCHIMP_LIST_ID || !MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX) {
  throw 'Some Mailchimp environment variables are undefined'
}

// tslint:disable-next-line: no-expression-statement
mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER_PREFIX,
})

type SubscribeResponse = {
  status: number
  message?: string
}

export const subscribe = async (email: string): Promise<SubscribeResponse> => {
  // 'pending' status means a confirmation email will be
  // sent before adding the email to the list
  // tslint:disable-next-line: no-expression-statement
  await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, {
    email_address: email,
    status: 'pending',
  })

  return { status: 201 }
}
