import {combine, parseSimpleTextFormatAbilityRenovation} from "../text/parseSimpleTextFormatAbilityRenovation"

describe("test combine function", () => {
  test("2 items", () => {
    const names = ["1", "2"]
    expect(combine(names)).toEqual([
      {combined: "12", split: ["1", "2"]}
    ])
  })
  test("3 items", () => {
    const names = ["1", "2", "3"]
    expect(combine(names)).toEqual([
      {combined: "12", split: ["1", "2"]},
      {combined: "23", split: ["2", "3"]},
      {combined: "123", split: ["1", "2", "3"]}
    ])
  })
})

describe("test parse function", () => {
  test("宮澤様邸.pdf, page 2", () => {
    const text = "\n\n名    称\n 【総合計】\n次頁へ続く\n仕様・規格単 位数 量単価金 額\n1656000\n備考\n明  細  書\nPage. 2"
    expect(parseSimpleTextFormatAbilityRenovation(text)).toEqual({
      status: "success",
      estimateSheet: {
        rowNames: [
          "【総合計】",
          "次頁へ続く",
        ],
        specifications: [],
        units: [],
        quantities: [],
        pricePerUnits: [],
        prices: [
          "1656000"
        ],
        notes: [],
      }
    })
  })

  test("宮澤様邸.pdf, page 3", () => {
    const text = "\n\n名    称\n仮設工事\n解体工事\n木工事\nﾊﾞﾙｺﾆｰ入口ｻｯｼ工事\n １階玄関屋根工事\nバルコニー工事\n内装工事\n産業廃棄処分費\n 【総合計】\n以下余白\n仕様・規格\n養生工事箇所屋内屋外\n ２階出入口 コロニアル屋根（ｱｽﾍﾞｽﾄ含）野地板垂木等\n玄関屋根下地外壁補修２階バルコニー出入口廻り屋内外\n LIXILﾌﾗｯｼｭﾄﾞｱ設置 W650H1820 ｻｯｼ定価￥57900\nアスファルトルーフィング板金屋根張り １寸勾配\n新規鼻先雨樋設置\nﾊﾞﾙｺﾆｰ本体LIXILﾋﾞｭｰｽﾃｰｼﾞHｽﾀｲﾙ 2階柱建式\n 1棟9尺×２．０間縦スリット セット定価￥1326500\n上記設置費\nﾊﾞﾙｺﾆｰ出入口屋内壁1面\n解体材及び発生材\n単 位\n式\n式\n式\n式\n式\n〃\n式\n〃\n式\n式\n数 量\n1\n1\n1\n1\n1\n1\n1\n1\n1\n1\n単価金 額\n19000\n91000\n278000\n51000\n169000\n51000\n720000\n225000\n23000\n29000\n1656000\n備考\n材工共\n材工共\n運搬設置費含む\n材工共\n材工共\n材工共\n運搬費含む\n明細書\nPage.3"
    expect(parseSimpleTextFormatAbilityRenovation(text)).toEqual({
      status: "success",
      estimateSheet: {
        "rowNames": [
          "仮設工事",
          "解体工事",
          "木工事",
          "ﾊﾞﾙｺﾆｰ入口ｻｯｼ工事",
          "１階玄関屋根工事",
          "バルコニー工事",
          "内装工事",
          "産業廃棄処分費",
          "【総合計】",
          "以下余白"
        ],
        "specifications": [
          "養生工事箇所屋内屋外",
          "２階出入口 コロニアル屋根（ｱｽﾍﾞｽﾄ含）野地板垂木等",
          "玄関屋根下地外壁補修２階バルコニー出入口廻り屋内外",
          "LIXILﾌﾗｯｼｭﾄﾞｱ設置 W650H1820 ｻｯｼ定価￥57900",
          "アスファルトルーフィング板金屋根張り １寸勾配",
          "新規鼻先雨樋設置",
          "ﾊﾞﾙｺﾆｰ本体LIXILﾋﾞｭｰｽﾃｰｼﾞHｽﾀｲﾙ 2階柱建式",
          "1棟9尺×２．０間縦スリット セット定価￥1326500",
          "上記設置費",
          "ﾊﾞﾙｺﾆｰ出入口屋内壁1面",
          "解体材及び発生材"
        ],
        "units": [
          "式",
          "式",
          "式",
          "式",
          "式",
          "〃",
          "式",
          "〃",
          "式",
          "式"
        ],
        "quantities": [
          "1",
          "1",
          "1",
          "1",
          "1",
          "1",
          "1",
          "1",
          "1",
          "1"
        ],
        "pricePerUnits": [],
        "prices": [
          "19000",
          "91000",
          "278000",
          "51000",
          "169000",
          "51000",
          "720000",
          "225000",
          "23000",
          "29000",
          "1656000"
        ],
        "notes": [
          "材工共",
          "材工共",
          "運搬設置費含む",
          "材工共",
          "材工共",
          "材工共",
          "運搬費含む",
        ]
      }
    })
  })
})