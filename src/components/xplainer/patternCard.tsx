import { createUseStyles } from "react-jss"
import { Menu, message } from 'antd'
import { useEffect, useState } from "react"
import Pattern from "./pattern"
import { NetworkPattern } from "./motifs/motif"
import { CloseOutlined } from '@ant-design/icons'
import { useDrag } from "react-dnd"

const useStyles = createUseStyles({
  widget: {
    backgroundColor: "#ffffff",
    backgroundClip: "padding-box",
    borderRadius: 8,
    boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    padding: 12,
    boxSizing: "border-box",
    width: 500,
    flexDirection: 'column',
    position: "absolute",
    zIndex: 10
  }
})

interface IPatternCardProps {
  visType: string
  open: boolean
  setOpen: (d: boolean) => void
  motifs: NetworkPattern[]
  offset: [number, number]
  currentMotif: string
  setCurrentMotif: (d: string) => void
}

function PatternCard (props: IPatternCardProps) {
  const { visType, open, setOpen, motifs, offset, currentMotif, setCurrentMotif} = props
  const classes = useStyles()
  const id = "xplainer"
  let left = offset[0], top = offset[1]

  const getMenuItems = () => {
    return motifs.map((motif: any, index: number) => {
      return {
        label: motif.type(),
        key: `${index}`
      }
    })
  }

  const onClick = (e: any) => {
    setCurrentMotif(e.key)
  }

  useEffect(()=>{
    setCurrentMotif('-1')
  }, [motifs])

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'box',
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top],
  )

  if (isDragging) {
    return <div ref={drag} />
  }

  return (
    <div id={id} ref={drag} className={classes.widget}
      style={{
        display: open ? "flex" : "none",
        transform: `translate(${left}px, ${top}px)`
      }}
    >
      <CloseOutlined
        style={{ position: 'absolute', right: 10, top: 10 }}
        onClick={() => setOpen(false)}
      />
      <Menu
        mode="horizontal"
        onClick={onClick}
        selectedKeys={currentMotif === '-1' ? [] : [currentMotif]}
        items={getMenuItems()}
      />
      {currentMotif === '-1' ? 
        <div>There is {motifs.length} patterns in total.</div> 
        : <Pattern visType={visType} motif={motifs[Number(currentMotif)]} />}
    </div>
  )
}

export default PatternCard