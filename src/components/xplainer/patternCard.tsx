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
    position: "relative",
    top: 0,
    right: 0,
    zIndex: 10
  }
})

interface IPatternCardProps {
  visType: string
  open: boolean
  setOpen: (d: boolean) => void
  motifs: NetworkPattern[]
  showClickRelatedMotif: boolean
  allMotifs: AllMotifs
  setHoverRelatedMotif: (d: NetworkPattern) => void
  setClickRelatedMotif: (d: NetworkPattern) => void 
  setSelectedMotifNo: (d: [number, number]) => void
}

function PatternCard (props: IPatternCardProps) {
  const { visType, open, setOpen, motifs, showClickRelatedMotif, allMotifs } = props
  const groupByType = groupBy(motifs, motif => motif.type())
  // console.log('groupByType', groupByType)

  const classes = useStyles()
  const id = "xplainer"
  // let left = offset[0], top = offset[1]

  const [topMenuKey, setTopMenuKey] = useState<number>(showClickRelatedMotif ? 0 : -1)
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
    if (Object.keys(groupByType).length > 0 && topMenuKey !== -1) {
      const name = Object.keys(groupByType)[topMenuKey]
      return groupByType[name].map((item, index) => {
        return {
          label: `${patternList[name].title} #${index + 1}`,
          key: index
        }
      })
    }
    else return []
  }

  useEffect(()=>{
    setSubMenuKey(0)
  }, [topMenuKey])

  useEffect(() => {
    props.setSelectedMotifNo([topMenuKey, subMenuKey])
  }, [topMenuKey, subMenuKey])


  useEffect(() => {
    setTopMenuKey(showClickRelatedMotif ? 0: -1)
  }, [motifs])

  const close = () => {
    setOpen(false)
    setTopMenuKey(-1)
    setSubMenuKey(-1)
    props.setHoverRelatedMotif({} as NetworkPattern)
    props.setClickRelatedMotif({} as NetworkPattern)
  }

  // const [{ isDragging }, drag] = useDrag(
  //   () => ({
  //     type: 'box',
  //     item: { id, left, top },
  //     collect: (monitor) => ({
  //       isDragging: monitor.isDragging(),
  //     }),
  //   }),
  //   [id, left, top],
  // )

  // if (isDragging) {
  //   return <div ref={drag} />
  // }

  return (
    <div 
      id={id} 
      // ref={drag} 
      className={classes.widget}
      style={{
        display: open ? "flex" : "none",
        // transform: `translate(${left}px, ${top}px)`
      }}
    >
      <CloseOutlined
        style={{ position: 'absolute', right: 10, top: 10 }}
        onClick={() => close()}
      />

      {/* motif type -- top menu */}
      <Menu
        mode="horizontal"
        onClick={(e: any) => setTopMenuKey(Number(e.key))}
        selectedKeys={topMenuKey === -1 ? [] : [`${topMenuKey}`]}
        items={getTopMenuItems()}
      />
      {/* motif instance in a specific type -- sub menu */}
      <Menu
        mode="horizontal"
        onClick={(e: any) => setSubMenuKey(Number(e.key))}
        selectedKeys={subMenuKey === -1 ? [] : [`${subMenuKey}`]}
        items={getSubMenuItems(topMenuKey)}
      />
      {(topMenuKey !== -1 && subMenuKey !== -1 && Object.keys(groupByType).length > 0) ? <Pattern
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