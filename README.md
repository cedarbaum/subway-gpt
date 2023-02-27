# [SubwayGPT](https://www.subwaygpt.app/)

This project generates NYC subway directions using AI.

It is largely based on [TwitterBio.com](https://github.com/Nutlope/twitterbio).

## How it works

This project uses the [OpenAI GPT-3 API](https://openai.com/api/) (specifically, text-davinci-003) and [Vercel Edge functions](https://vercel.com/features/edge-functions) with streaming. It constructs a prompt based on the form and user input, sends it to the GPT-3 API via a Vercel Edge function, then streams the response back to the application.

## This doesn't work all that well...

While GPT-3 can occasionally give very accurate/natural subway directions, the model still appears to have difficulty with spatial/navigational problems. I am not an AI expert, but others have experimented and written about this previously:

- https://towardsdatascience.com/gpt-3-navigates-the-new-york-subway-f28ea49fcead
- https://www.youtube.com/watch?v=Xzb1Vc8dYAY (presentation of above)

It should be noted, however, that OpenAI's ChatGPT does, in my experience, give better directions then the standalone GPT-3 model. I would encourage you to try it out: https://chat.openai.com/chat

Further, the prompt generation and model parameters can likely be improved upon.

Finally, this app does not currently take into account service alerts. These could be incorporated into the prompt generation relatively easily. A more conversational approach (e.g., ChatGPT) could also be used here to allow alternative routes on the fly:

> **> User:** Give me subway directions from Bushwick to Midtown

> **> Bot:**  Take the L to Union Square and then transfer to the N/Q/R/W

> **> User:** The L isn't running

> **> Bot:**  Take the J to Delancey/Essex and then transfer to the F

## Running Locally

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a file called `.env`.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```
