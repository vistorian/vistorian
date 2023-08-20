import { createUseStyles } from "react-jss"
import { Menu, message } from 'antd'
import { useEffect, useState } from "react"
import Pattern from "./pattern"
import { NetworkPattern } from "./motifs/motif"
import { CloseOutlined } from '@ant-design/icons'
import { useDrag } from "react-dnd"
import { AllMotifs } from "../../../typings"

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
  allMotifs: AllMotifs
  setHoverRelatedMotif: (d: NetworkPattern) => void
  setClickRelatedMotif: (d: NetworkPattern) => void 
  currentMotif?: string
  setCurrentMotif?: (d: string) => void
}

function PatternCard (props: IPatternCardProps) {
  const { visType, open, setOpen, motifs, offset, allMotifs } = props
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
    // @ts-ignore
    props.setCurrentMotif(e.key)
  }

  const close = () => {
    setOpen(false)
    props.setHoverRelatedMotif({} as NetworkPattern)
    props.setClickRelatedMotif({} as NetworkPattern)
  }

  useEffect(()=>{
    if (props.setCurrentMotif)
      props.setCurrentMotif('-1')
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
        onClick={() => close()}
      />

      {props.currentMotif ? 
      // user select an area and show a list of motifs in this area
      <> 
        <Menu
        mode="horizontal"
        onClick={onClick}
        selectedKeys={props.currentMotif === '-1' ? [] : [props.currentMotif]}
        items={getMenuItems()}
        />
        {props.currentMotif === '-1' ?
          <div>There is {motifs.length} patterns in total.</div>
          :
          <Pattern
            visType={visType}
            motif={motifs[Number(props.currentMotif)]}
            allMotifs={allMotifs}
            setHoverRelatedMotif={props.setHoverRelatedMotif}
            setClickRelatedMotif={props.setClickRelatedMotif}
          />}
      </> : 
      // jump to related motif
      <>
          <Pattern
            visType={visType}
            motif={motifs[0]}
            allMotifs={allMotifs}
            setHoverRelatedMotif={props.setHoverRelatedMotif}
            setClickRelatedMotif={props.setClickRelatedMotif}
          />
      </>}
    </div>
  )
}

export default PatternCard