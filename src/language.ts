import { Trade } from './train'

export default class Language {
  greetings(): string {
    return "Greetings!"
  }

  goodbye(): string {
    return "Goodbye!"
  }

  tradeDeclaration(trade: Trade): string {
    console.log(trade)
    return `I have <strong>${trade.has}</strong> and want <strong>${trade.wants}</strong>`
  }

  thanks(): string {
    return "Ahh, thanks for the thing!"
  }

  noThanks(): string {
    return "Ugh, why would I want THAT?"
  }

  goForward(): string {
    return "I think someone is <strong>that way</strong>."
  }

  goBackward(): string {
    return "I think someone is <strong>this-a-way</strong>."
  }
}