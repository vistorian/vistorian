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
    minWidth: 500,
    maxWidth: 500,
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
  allMotifs: AllMotifs
  networkData: any
  setHoverRelatedMotif: (d: NetworkPattern) => void
  setClickRelatedMotif: (d: NetworkPattern) => void 
  selectedMotifNo: [number, number]
  setSelectedMotifNo: (d: [number, number]) => void
  snapshots: any
}

function PatternCard (props: IPatternCardProps) {
  const { visType, open, setOpen, motifs, allMotifs, networkData, selectedMotifNo, setSelectedMotifNo } = props
  const groupByType = groupBy(motifs, motif => motif.type())
  // console.log('motifs:', motifs, 'selectedMotifNo', selectedMotifNo)

  const classes = useStyles()
  const id = "xplainer"
  // let left = offset[0], top = offset[1]

  // draw top menu items
  const getTopMenuItems = () => {
    return Object.keys(groupByType).map((name: string, index: number) => {
      // console.log(name)
      return {
        label: `${patternList[name].title} (${groupByType[name].length})`,
        key: index
      }
    })
  }

  // draw sub menu items
  const getSubMenuItems = (topMenuKey: number) => {
    if (Object.keys(groupByType).length > 0 && topMenuKey !== -1) {
      const name = Object.keys(groupByType)[topMenuKey]
      // console.log('topMenuKey:', topMenuKey, 'name', name)
      return groupByType[name].map((item, index) => {
        return {
          label: `${patternList[name].title} #${index + 1}`,
          key: index
        }
      })
    }
    else return []
  }

  const close = () => {
    setOpen(false)
    setSelectedMotifNo([-1, 0])
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
        onClick={(e: any) => setSelectedMotifNo([Number(e.key), 0])}
        selectedKeys={selectedMotifNo[0] === -1 ? [] : [`${selectedMotifNo[0]}`]}
        items={getTopMenuItems()}
      />
      {/* motif instance in a specific type -- sub menu */}
      <Menu
        mode="horizontal"
        onClick={(e: any) => setSelectedMotifNo([selectedMotifNo[0], Number(e.key)])}
        selectedKeys={selectedMotifNo[1] === -1 ? [] : [`${selectedMotifNo[1]}`]}
        items={getSubMenuItems(selectedMotifNo[0])}
      />
      {(selectedMotifNo[0] !== -1 && selectedMotifNo[1] !== -1 && Object.keys(groupByType).length > 0) ? 
        <Pattern
          visType={visType}
          motif={groupByType[Object.keys(groupByType)[selectedMotifNo[0]]][selectedMotifNo[1]]}
          allMotifs={allMotifs}
          networkData={networkData}
          setHoverRelatedMotif={props.setHoverRelatedMotif}
          setClickRelatedMotif={props.setClickRelatedMotif}
          setSelectedMotifNo={setSelectedMotifNo}
          snapshots={props.snapshots}
        /> : null}
      
    </div>
  )
}

export default PatternCard