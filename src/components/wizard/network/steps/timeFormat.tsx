import { createUseStyles } from 'react-jss'
import { useState } from 'react'
import { Modal, Input, Button } from 'antd' 
import { directives, DirectiveItem } from './timeFormatDirectives'
import { timeFormat } from 'd3-time-format'

const useStyles = createUseStyles({
  directive: {
    border: '1px solid lightgrey',
    borderRadius: 15,
    paddingLeft: '1em',
    paddingRight: '1em',
    marginBottom: '1em'
  },
  row: {
    display: 'flex',
    marginBottom: 10,
  },
  button: {
    width: 55,
    height: 55,
    fontSize: 16
  },
  exp: {
    fontSize: '1rem',
    marginLeft: 20
  }
})

interface ITimeFormat {
  open: boolean
  setOpen: (status: boolean) => void
  formatString: string
  setFormatString: (str: string) => void
}

function TimeFormat(props: ITimeFormat) {
  const classes = useStyles()
  const { open, setOpen, formatString, setFormatString } = props

  const formatter = timeFormat(formatString)
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormatString(e.target.value)
  }

  const handleAddCode = (code: string) => {
    setFormatString(formatString.concat(code))
  }

  return (
    <Modal 
      title="Datetime format" 
      footer={null}
      open={open} 
      onOk={() => setOpen(false)} 
      onCancel={() => setOpen(false)}
    >
      <p><b>Type in the input box to edit the format string, or click on a button to append the corresponding directive. You can manually enter character such as colons, hyphens, spaces, or parentheses.</b></p>

      <span style={{ display: 'flex'}}>Date format:
        <Input 
          style={{ width: 200, marginLeft: 10 }} 
          value={formatString} 
          onChange={handleInput} 
        />
      </span>
      <br />
      <span>In this format, the current datetime is <b>{formatter(new Date())}</b>.</span>

      <h2>Possible directives:</h2>
      {Object.keys(directives).map((type: string)=>{
        return (
          <div className={classes.directive} key={type}>
            <h2>{type}</h2>
            {directives[type].map((directive: DirectiveItem, i: number) => {
              return (
                <div className={classes.row} key={i}>
                  <Button className={classes.button} onClick={()=>handleAddCode(directive.code)}>+<br />{directive.code}</Button>
                  <span className={classes.exp}>{directive.definition} (currently <b>{timeFormat(directive.code)(new Date())}</b>)</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </Modal>
  )
}

export default TimeFormat