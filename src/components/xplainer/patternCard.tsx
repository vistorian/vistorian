import { createUseStyles } from "react-jss"
import { Menu, message } from 'antd'
import { useEffect, useState } from "react"
import Pattern from "./pattern"
import { NetworkPattern } from "./motifs/motif"
import { CloseOutlined } from '@ant-design/icons'
import { useDrag } from "react-dnd"
import { AllMotifs } from "../../../typings"
import { groupBy } from "lodash-es"
import { PatternList, patternList } from "./patternList"

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
  const groupByType = groupBy(motifs, motif => motif.type())
  // console.log('groupByType', groupByType)

  const classes = useStyles()
  const id = "xplainer"
  let left = offset[0], top = offset[1]

  const [topMenuKey, setTopMenuKey] = useState<number>(0)
  const [subMenuKey, setSubMenuKey] = useState<number>(0)

  const getTopMenuItems = () => {
    return Object.keys(groupByType).map((name: string, index: number) => {
      return {
        label: `${patternList[name].title} (${groupByType[name].length})`,
        key: index
      }
    })
  }

  const getSubMenuItems = (topMenuKey: number) => {
    if (Object.keys(groupByType).length > 0) {
      const name = Object.keys(groupByType)[topMenuKey]
      return groupByType[name].map((item, index) => {
        return {
          label: `${name} #${index + 1}`,
          key: index
        }
      })
    }
    else return []
  }

  const close = () => {
    setOpen(false)
    props.setHoverRelatedMotif({} as NetworkPattern)
    props.setClickRelatedMotif({} as NetworkPattern)
  }

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

      {/* motif type -- top menu */}
      <Menu
        mode="horizontal"
        onClick={(e: any) => setTopMenuKey(e.key)}
        selectedKeys={[`${topMenuKey}`]}
        items={getTopMenuItems()}
      />
      {/* motif instance in a specific type -- sub menu */}
      <Menu
        mode="horizontal"
        onClick={(e: any) => setSubMenuKey(e.key)}
        selectedKeys={[`${subMenuKey}`]}
        items={getSubMenuItems(topMenuKey)}
      />
      {Object.keys(groupByType).length > 0 ? <Pattern
        visType={visType}
        motif={groupByType[Object.keys(groupByType)[topMenuKey]][subMenuKey]}
        allMotifs={allMotifs}
        setHoverRelatedMotif={props.setHoverRelatedMotif}
        setClickRelatedMotif={props.setClickRelatedMotif}
      /> : null}
      
    </div>
  )
}

export default PatternCard