import {describe, expect, test} from "vitest"
import {reorderColumn} from "./table"

describe("test reorderColumn function", () => {
  const columnData = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six"
  ]
  test("test startIndex === endIndex, it should be skipped", () => {
    expect(reorderColumn(columnData, 3, 3)).toEqual(columnData)
  })
  test("test startIndex > endIndex with overwrite, therefore it should be skipped", () => {
    expect(reorderColumn(columnData, 3, 2)).toEqual(columnData)
  })
  test("test startIndex > endIndex, without overwrite", () => {
    const testData = [...columnData]
    testData.splice(2, 0, "")
    expect(reorderColumn(testData, 3, 2)).toEqual(columnData)
  })
  test("test startIndex < endIndex", () => {
    const expectedData = [...columnData]
    expectedData.splice(2, 0, "")
    expect(reorderColumn(columnData, 2, 3)).toEqual(expectedData)
  })
})