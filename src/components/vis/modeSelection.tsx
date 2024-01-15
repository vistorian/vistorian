import { Button } from "antd"
import { Link } from "react-router-dom"
import { FileSearchOutlined, BulbOutlined, FormOutlined } from '@ant-design/icons'
import { Mode } from "../../../typings/status.enum"

interface IModeSelectionProps {
  type: Mode,
  visTypes: string
  network: string
}


function ModeSelection(props: IModeSelectionProps) {
  const modes: Mode[] = [Object.values(Mode)[0]]

  const icons = [<FileSearchOutlined />]

  return (
    <div style={{ display: 'flex' }}>
      <Button
        type='primary'
        icon={icons[0]}
        size="large"
        key={0}
      >
        {modes[0]}
      </Button>
    </div>
  )
}

// support multiple modes
// function ModeSelection(props: IModeSelectionProps) {
//   const modes: Mode[] = Object.values(Mode)

//   const icons = [<FileSearchOutlined />, <BulbOutlined />, <FormOutlined />]
  
//   return (
//     <div style={{ display: 'flex'}}>
//       {modes.map((mode: string, index: number) => {
//         if (props.type === mode) {
//           return (
//             <Button
//               type='primary'
//               icon={icons[index]}
//               size="large"
//               key={index}
//             >
//               {modes[index]}
//             </Button>
//           )}
//         else {
//           return (
//             <Link
//               to={`/vis/${props.visTypes}/network/${props.network}/${mode === Mode.Explorer ? '' : mode}`}
//               target='_blank'
//               key={index}
//             >
//               <Button
//                 type='text'
//                 icon={icons[index]}
//                 size="large"
//               >
//                 {modes[index]}
//               </Button>
//             </Link> 
//         )}
//       })}
//     </div>
//   )
// }

export default ModeSelection