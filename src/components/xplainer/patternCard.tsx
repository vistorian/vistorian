import { createUseStyles } from "react-jss"
import { Menu, message } from 'antd'
import { useEffect, useState } from "react"
import Pattern from "./pattern"
import { NetworkPattern } from "./motifs/motif"
import { CloseOutlined } from '@ant-design/icons'

const useStyles = createUseStyles({
  root: {
    backgroundColor: "#ffffff",
    backgroundClip: "padding-box",
    borderRadius: 8,
    boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    padding: 12,
    boxSizing: "border-box",
    width: 500,
    flexDirection: 'column',
    position: "absolute",
    zIndex: 2
  }
})

interface IPatternCardProps {
  open: boolean
  setOpen: (d: boolean) => void
  motifs: NetworkPattern[]
  offset: [number, number]
}

function PatternCard (props: IPatternCardProps) {
  const { open, setOpen, motifs, offset } = props
  const classes = useStyles()

  const [current, setCurrent] = useState('0')

  const getMenuItems = () => {
    return motifs.map((motif: any, index: number) => {
      return {
        label: motif.type(),
        key: `${index}`
      }
    })
  }

  const onClick = (e: any) => {
    setCurrent(e.key)
  }

  useEffect(()=>{
    setCurrent('0')
  }, [motifs])

  return (
    <div className={classes.root}
      style={{
      display: open ? "flex" : "none",
      transform: `translate(${offset[0]}px, ${offset[1]}px)`
    }}
    >
      <CloseOutlined
        style={{ position: 'absolute', right: 10, top: 10 }}
        onClick={() => setOpen(false)}
      />
      <Menu
        mode="horizontal"
        onClick={onClick}
        selectedKeys={[current]}
        items={getMenuItems()}
      />
      <Pattern motif={motifs[Number(current)]} />
    </div>
  )
}

export default PatternCard