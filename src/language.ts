import { Item, Trade } from './train'
import _ from 'lodash';

export default class Language {
  uppercaseConsonants = "ÇÐÑĆϾҊҨϿӜĈĊČĎϢĐϨĜĞĠĢĤĦĴĶĹŅŇĻŔŘŜŞŠŴŤŹŽŻŦŢŚŖĿĽŃ§ƁƆƇƉƊƤƑƓƘƜƝƔƦƧƩƪƬƮƲƵ".split("")
  lowercaseConsonants = "ðÞñćĉќѝċčгдҩďӝﬠאּđĝğġϣģϩĥħĵķĺþĸņňŋļľŀłńŕŗřśŝŵźżžşšţťŧƿƄƅƈƌſƗƒƃƍƕƙƚƛƞƥƨƫƭ".split("")

  uppercaseVowels = "ÁÂÃÄÅÆÈÉÊËÌÍÎÏÒϘÓѦÔÕÖÙĮÚÛÜÝĂĄĒĔĖĘĚĨĪĬİ¥ŎŒŨŪŬŰŲŮŶŸŐŌƂƋƎƖƟƏƐƠƢƯƱƳ".split("")
  lowercaseVowels = "àáâãäåæçèéêўзëìеѧįәíфϙîïòóҽôõöùúûüýÿāăąēĕėęěĩīĭıōŏőœũūŭůűųŷơƣưƴ".split("")

  npcGreeting: string
  menuGreeting: string

  npcNoThanksBase: string
  npcForward: string
  npcBackward: string

  menuTradeBase: string
  menuAskBase: string
  menuGoodbye: string
  menuOkay: string

  items: Item[] = []

  palette = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ff00ff",
    "#ffff00",
    "#00ffff"
  ]

  item(): Item {
    const word = this.itemWord();
    const color = this.palette.shift()!

    const item = {name: word, color}

    this.items.push(item)
    return item
  }

  itemWord(): string {
    let wordLength = _.random(3, 5)
    return this.word(wordLength, true)
  }

  constructor() {
    let greeting = this.greetings()
    this.npcGreeting = greeting + "!"
    this.menuGreeting = `${greeting} ${this.word(_.random(3, 10))}!`

    this.menuGoodbye = this.sentence(_.sample([1, 1, 2])!).join("") + "!"
    this.menuOkay = this.sentence(_.sample([1, 1, 2])!).join("") + "!"

    const tradeWords = _.sample([2, 2, 3, 3, 3, 3, 4])!
    this.menuTradeBase = _.shuffle(this.sentence(tradeWords).concat(["<strong style='color: #color#;'>#item#</strong>"])).join(" ") + "."

    const noThanksWords = _.sample([2, 3, 3, 3, 3, 4, 5])!
    this.npcNoThanksBase = _.shuffle(this.sentence(noThanksWords).concat(["<strong style='color: #color#;'>#item#</strong>"])).join(" ") + "."

    let directionWords = _.sample([2, 2, 3, 3, 3, 3, 4])!
    let direction = _.shuffle(this.sentence(directionWords).concat(["<strong>#dir#</strong>"])).join(" ") + "."
    let forward = this.word(_.random(3, 8), true)
    let backward = this.word(_.random(3, 8), true)

    this.npcForward = direction.replace("#dir#", forward)
    this.npcBackward = direction.replace("#dir#", backward)

    const askWords = _.sample([2, 2, 3, 3, 3, 3, 4, 4])!
    this.menuAskBase = _.shuffle(this.sentence(askWords).concat(["<strong style='color: #color#;'>#item#</strong>"])).join(" ") + "."

    this.palette = _.shuffle(this.palette)
  }

  menuTrade(item: Item) {
    return this.menuTradeBase
      .replace("#item#", item.name)
      .replace("#color#", item.color)
  }

  menuAsk(item: Item) {
    return this.menuAskBase
      .replace("#item#", item.name)
      .replace("#color#", item.color)
  }

  greetings(): string {
    const numberOfWords = _.sample([1, 1, 2, 2, 2, 3, 3])!
    return this.sentence(numberOfWords).join(" ")
  }

  tradeDeclaration(trade: Trade): string {
    const numberOfWords = _.sample([5, 6])!
    let sentence = this.sentence(numberOfWords)

    let wantIndex = _.random(0, 2)
    let hasIndex = _.random(numberOfWords - 1, numberOfWords - 2)

    sentence[wantIndex] = `<strong style="color: ${trade.wants.color};">${trade.wants.name}</strong>`
    sentence[hasIndex] = `<strong style="color: ${trade.has.color};">${trade.has.name}</strong>`

    return sentence.join(" ") + "."
  }

  thanks(): string {
    // TODO: Put in item.
    const numberOfWords = _.sample([4, 5, 6])!
    return this.sentence(numberOfWords).join(" ") + "."
  }

  npcNoThanks(item: Item): string {
    return this.npcNoThanksBase
      .replace("#item#", item.name)
      .replace("#color#", item.color)
  }

  //

  private sentence(length: number): string[] {
    let words: string[] = []

    let usedCapital = false
    for (let i = 0; i < length; i++) {
      let wordLength = _.random(3, 5)
      words.push(this.word(wordLength, !usedCapital))
      usedCapital = true
    }
    return words;
  }

  private word(length: number, startCapital = false): string {
    let word = ""

    let lastWasConsonant = false
    let lastTwoWereSame = false

    const nextChar = (uppercase: boolean = false) => {
      let bucket;

      if (lastWasConsonant) {
        if (_.random(0, 6) > 0 || lastTwoWereSame) {
          bucket = this.lowercaseVowels;
          lastWasConsonant = false
          lastTwoWereSame = false
        } else {
          bucket = this.lowercaseConsonants
          lastWasConsonant = true
          lastTwoWereSame = true
        }
      } else {
        if (_.random(0, 4) > 0 || lastTwoWereSame) {
          bucket = this.lowercaseConsonants;
          lastWasConsonant = true
          lastTwoWereSame = false
        } else {
          bucket = this.lowercaseVowels
          lastWasConsonant = false
          lastTwoWereSame = true
        }
      }

      if (uppercase) {
        if (bucket === this.lowercaseVowels) {
          console.log("Uppercase vowel")
          bucket = this.uppercaseVowels
        } else if (bucket === this.lowercaseConsonants) {
          console.log("Uppercase consonant")
          bucket = this.uppercaseConsonants
        }
      }

      return _.sample(bucket)
    }

    word = nextChar(startCapital)!
    while (word.length < length) {
      word += nextChar()
    }

    return word;
  }
}