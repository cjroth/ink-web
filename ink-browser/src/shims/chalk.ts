// Browser shim for Chalk - provides ANSI color support
// Chalk is bundled, so we create a minimal implementation

const createChalkInstance = () => {
  const chalk: any = (str: string) => str
  
  // Color methods - just return the input since xterm will handle colors
  const colors = [
    'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'gray', 'grey', 'blackBright', 'redBright', 'greenBright', 'yellowBright',
    'blueBright', 'magentaBright', 'cyanBright', 'whiteBright',
    'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite',
    'bgBlackBright', 'bgRedBright', 'bgGreenBright', 'bgYellowBright',
    'bgBlueBright', 'bgMagentaBright', 'bgCyanBright', 'bgWhiteBright'
  ]
  
  colors.forEach(color => {
    chalk[color] = (str: string) => str
  })
  
  // Style methods
  chalk.bold = (str: string) => str
  chalk.dim = (str: string) => str
  chalk.italic = (str: string) => str
  chalk.underline = (str: string) => str
  chalk.inverse = (str: string) => str
  chalk.strikethrough = (str: string) => str
  
  // Support chaining
  Object.keys(chalk).forEach(key => {
    if (typeof chalk[key] === 'function') {
      colors.forEach(color => {
        chalk[key][color] = chalk[key]
      })
      chalk[key].bold = chalk[key]
      chalk[key].dim = chalk[key]
      chalk[key].italic = chalk[key]
      chalk[key].underline = chalk[key]
      chalk[key].inverse = chalk[key]
      chalk[key].strikethrough = chalk[key]
    }
  })
  
  chalk.level = 3
  chalk.supportsColor = { level: 3, hasBasic: true, has256: true, has16m: true }
  
  return chalk
}

const chalk = createChalkInstance()
export default chalk
