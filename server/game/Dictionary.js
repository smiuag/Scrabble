import fs from 'fs'

export class Dictionary {
  constructor() {
    this.words = new Set()
  }

  load(filePath) {
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      for (const word of raw) {
        this.words.add(word.toUpperCase())
      }
      console.log(`📚 Dictionary loaded: ${this.words.size} words`)
    } catch (err) {
      console.error('Failed to load dictionary:', err.message)
      throw err
    }
  }

  isValid(word) {
    return this.words.has(word.toUpperCase())
  }

  validateAll(words) {
    const invalid = words.filter(word => !this.isValid(word))
    return {
      valid: invalid.length === 0,
      invalidWords: invalid
    }
  }
}
