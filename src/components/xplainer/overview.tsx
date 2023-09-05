import { Collapse, Switch, Tag } from "antd"
import type { CollapseProps } from 'antd';
import { AllMotifs } from "../../../typings"
import { patternList } from "./patternList";
import { useEffect, useState } from "react";

interface Props {
  allMotifs: AllMotifs
  setSelectedTypes: (t: string[]) => void
  // checked: boolean
  // setChecked: (b: boolean) => void
}

function Overview(props: Props) {
  const [tags, setTags] = useState<boolean[]>([])
  const [display, setDisplay] = useState<boolean>(false)

  const getText = (name: string) => {
    if (name in patternList) {
      return patternList[name].description
    }
    else return ''
  }

  const getPanel = (name: string, cnt: number) => {
    return (
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <img 
            src={`./pattern-icons/${name}.png`}
            style={{width: 30, height: 30, marginRight: 8, border: '1px solid #535353', borderRadius: 4}} />
          <span>{patternList[name].title}</span>
        </div>
        <span>{cnt}</span>
      </div>
    )
  }

  const getItems = () => {
    const items = Object.keys(props.allMotifs).map((motif, index) => {
      return ({
        key: index,
        label: getPanel(motif, props.allMotifs[motif].length),
        children: <p>{getText(motif)}</p>
      })
    }) as CollapseProps['items']
    return items
  }

  const getTags = () => {
    return (<>
      {Object.keys(props.allMotifs).map((motif: string, index: number) => {
        // console.log('motif:', motif)
        return <Tag 
          key={index}
          color={tags[index] ? '#E17918' : 'default'} 
          onClick={() => {const tmp = [...tags]; tmp[index] = !tags[index]; setTags(tmp)}}>
            {patternList[motif].title}
          </Tag>
      })}
    </>)
  }

  const getFilteredTags = () => {
    const all = Object.keys(props.allMotifs)
    const others = Object.keys(patternList).filter(p => !all.includes(p))
    return (<>
      {others.map((motif: string, index: number) => {
        return <Tag
          key={index}
          color={tags[index] ? '#E17918' : 'default'}
          onClick={() => { const tmp = [...tags]; tmp[index] = !tags[index]; setTags(tmp) }}>
          {patternList[motif].title}
        </Tag>
      })}
    </>)
  }

  useEffect(() => {
    if (props.allMotifs && Object.keys(props.allMotifs).length > 0) {
      setTags(new Array(Object.keys(props.allMotifs).length).fill(false))
    }
  }, [props.allMotifs])

  useEffect(()=>{
    const tmp = Object.keys(props.allMotifs).filter((motif: string, index: number) => {
      return tags[index]
    })
    props.setSelectedTypes(tmp)
  }, [tags])

  const onChange = () => {
    if (tags.filter(t => !t).length === 0) { // every tag selected
      setTags([...tags].map(i=>false))
    }
    else {
      setTags([...tags].map(i=>true))
    }
  }

  return (
    <div>
      <p style={{ fontSize: 18, display: 'flex', justifyContent: 'space-between' }}>
        <b>Pattern Overview:</b>
        {/* <Switch size='small' 
          checked={tags.filter(t=>!t).length === 0} 
          onChange={onChange} 
        /> */}
        <Switch size='small'
          checked={display}
          onChange={() => setDisplay(!display)}
        />
      </p>
      <div style={{ marginBottom: 10, display: display ? 'inherit' : 'none' }}>
        <span style={{fontWeight: 'bold'}}>Filter:</span> <br />
        {(props.allMotifs && Object.keys(props.allMotifs).length > 0) ?
         getTags() : null}
      </div>
      {(props.allMotifs && Object.keys(props.allMotifs).length > 0) ? 
        <Collapse
          style={{display: display ? 'inherit' : 'none'}}
          items={getItems()}
          bordered={false}
          defaultActiveKey={[]}
        /> : null}

      {/* <div style={{ marginBottom: 10 }}>
        <span style={{ fontWeight: 'bold' }}>Patterns not in this network:</span> <br />
        {(props.allMotifs) ?
          getFilteredTags() : null}
      </div> */}
    </div>
  )
}

export default Overview