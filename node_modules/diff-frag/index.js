module.exports = diff => {
  const lines = diff.split('\n')
  const trim = []

  // first, scan through to find the --- and +++ lines
  // --- expected
  // +++ actual
  let header = 0
  for (let i = 0; i < lines.length && header === 0; i++) {
    const line = lines[i]
    trim.push(line)
    if (/^---/.test(line) && /^\+\+\+/.test(lines[i - 1]) ||
        /^\+\+\+/.test(line) && /^---/.test(lines[i - 1])) {
      header = i + 1
    }
  }

  let actualLine = 0
  let expectLine = 0
  // context line is like:
  // @@ -${expLine},${expLineInc} +${objLine},${objLinesInc} ${context}
  let context = '' // last line that was not indented
  for (let i = header; i < lines.length; i++) {
    const line = lines[i]
    actualLine ++
    expectLine ++
    if (/^ [^ \t\s]/.test(line) && line.trim()) {
      context = line.slice(1).trim()
      if (context.length > 30)
        context = context.slice(0, 27) + '...'
      continue
    }
    if (/^[-+]/.test(line)) {
      // start of a diff section
      const sectionStart = Math.max(i - 3, header) // line offset to start section
      const actualStart = Math.max(actualLine - 3, 1)
      const expectStart = Math.max(expectLine - 3, 1)
      let trailingContext = 0
      while (i < lines.length && trailingContext < 3) {
        const line = lines[i++]
        if (!line)
          continue
        const pm = line.match(/(^[-+ ])/)[1]
        if (pm === ' ') {
          trailingContext ++
          expectLine ++
          actualLine ++
        } else {
          trailingContext = 0
          if (pm === '-')
            expectLine ++
          else
            actualLine ++
        }
      }
      const prefix = `@@ -${
        expectStart
      },${
        expectLine - expectStart
      } +${
        actualStart
      },${
        actualLine - actualStart
      } @@ ${context}`
      trim.push(prefix, ...lines.slice(sectionStart, i))
    }
  }

  return trim.join('\n')
}
