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
  }
  else if (type === 'nodeType') {
    scale = d3.scaleOrdinal().domain(list).range(scheme)
  }
  
  
  const update = () => {
    const svg = svgRef.current
    // console.log('svg', svg)
    d3.select(svg).selectAll('*').remove()
    const g = d3.select(svg)
      .append("g")
      .attr("transform", "translate(0, 0)")
    g.append("rect")
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 13)
      .attr('height', 13)
      .attr('fill', scale(name))
    g.append('text')
      .attr('x', 20)
      .attr('y', 13)
      .style("font-size", 14)
      .text(name)
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
