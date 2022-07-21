import { env } from "../env"

const Slack = require('slack-node')

const webhookUrl = env.slack.webhookUrl

const slack = new Slack();
slack.setWebhook(webhookUrl);

export const send = async (message: any) => {
    slack.webhook(
        {
            text: `${message}`,
        },
        function (err: any, response: any) {
            if (err) {
                console.log(response);
            }
        },
    );
}