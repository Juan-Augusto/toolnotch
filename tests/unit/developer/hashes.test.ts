import { md5, generateHashes } from '@/lib/developer/hashes'

describe('lib/developer/hashes', () => {
  describe('md5', () => {
    test('computes correct MD5 for known strings', () => {
      // MD5("") = d41d8cd98f00b204e9800998ecf8427e
      expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
      // MD5("hello") = 5d41402abc4b2a76b9719d911017c592
      expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592')
      // MD5("ToolNotch") = b323e9539f343053f3682e240fe5af0c
      expect(md5('ToolNotch')).toBe('b323e9539f343053f3682e240fe5af0c')
    })
  })

  describe('generateHashes', () => {
    test('generates all standard hashes for input string', async () => {
      const text = 'hello'
      const hashes = await generateHashes(text)

      expect(hashes.md5).toBe('5d41402abc4b2a76b9719d911017c592')
      expect(hashes.sha1).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d')
      expect(hashes.sha256).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
      expect(hashes.sha384).toHaveLength(96)
      expect(hashes.sha512).toHaveLength(128)
    })

    test('generates HMAC when secret key is provided', async () => {
      const text = 'hello'
      const secret = 'secret-key'
      const hashes = await generateHashes(text, secret)

      expect(hashes.hmacSha256).toBeDefined()
      expect(hashes.hmacSha256).toHaveLength(64)
      expect(hashes.hmacSha512).toBeDefined()
      expect(hashes.hmacSha512).toHaveLength(128)
    })
  })
})
