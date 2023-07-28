import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

interface ILegentItemProps {
  type: string
  name: string
  list: string[]
  scheme: string | string[]
}

export default function LegendItem(props: ILegentItemProps) {
  const { type, name, list, scheme } = props
  const svgRef = useRef(null)

  let scale: any
  if (type === 'linkType') {
    if (scheme === 'category10') {
      scale = d3.scaleOrdinal().domain(list).range(d3.schemeCategory10)
    }
    else {
      scale = d3.scaleOrdinal().domain(list).range(scheme)
    }
  }
  else if (type === 'nodeType') {
    scale = d3.scaleOrdinal().domain(list).range(scheme)
  }
  
  const update = () => {
    const svg = svgRef.current
    d3.select(svg).selectAll('*').remove()

    const g = d3.select(svg)
      .append("g")
      .attr("transform", "translate(0, 0)")
    if (type === 'linkType') {
      g.append("rect")
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 13)
        .attr('height', 13)
        .attr('fill', scale(name))
    }
    else if (type === 'nodeType') {
      const pair = { 'circle': d3.symbolCircle, 'square': d3.symbolSquare, 'cross': d3.symbolCross, 'diamond': d3.symbolDiamond, 'triangle': d3.symbolTriangle2}
      if (scale(name) in pair) {
        // @ts-ignore
        g.append('path').attr('d', d3.symbol().type(pair[scale(name)]).size(70))
          .attr("transform", "translate(7, 7)")
      }
      else {
        // TODO: add customized node shapes
        g.append('path').attr('d', scale(name))
          .attr("transform", "translate(7, 7)")
      }
    }

    g.append('text')
      .text(name)
      .attr('x', 20)
      .attr('y', 13)
      .style("font-size", 13)
  }

  useEffect(()=>{
    update()
  })

  return (
    <div style={{ width: '100%', height: 15, padding: "1px 0px"}}>
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  )
}
