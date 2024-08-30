import React, {FC, useContext, useState} from 'react';
import {Modal} from 'antd';
import {createUseStyles} from "react-jss";
import {PlusCircleOutlined} from "@ant-design/icons";
import SearchBar from "./searchBar";
import {Session} from "../../../../typings";
import {find} from "lodash-es";
import templates from "../../templates/templates";
import {VisBox} from "./visBox";
import {StoryContext} from "../context";
import NetVis from "../editor/netvis";

const useStyles = createUseStyles({
    visBox: {
        border: '1px dashed gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '250px',
        fontStyle: 'italic',
        fontSize:'13px',
        margin:5,
    },
    visContainer:{
        width: "100%",
        maxHeight: '95vh',
        overflow: 'scroll',
    },
    visCaption:{
        width: "100%",
        height: '30px',
    },
    cards: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingRight:'5px',
    },
})


interface VisModalProps {
    storyId: string,
    editorId:number,
    editorType:string,
    addVisToEditor: (editorId: number,  editorType: string, vis: string, network: string) => void;
}

const VisModal: React.FC<VisModalProps> = ({ addVisToEditor, storyId,editorId, editorType }) => {
// const VisModal: React.FC = ({storyId}) => {

   // const [isAddedVis, setAddedVis] = useState(false);
    const classes = useStyles()
    const {sessionStore, setSessionStore} = useContext(StoryContext)
    const sortSession = (a: Session, b: Session) => {
        return Date.parse(b.created) - Date.parse(a.created)
    }

    const [keyword, setKeyword] = useState('');
    const [activeFilter, setActiveFilter] = useState(sessionStore);
    const updateKeyword = (keyword) => {
        const filtered = sessionStore.filter(session => {
            return `${session.network.toLowerCase()}`.includes(keyword.toLowerCase());
        })
        setKeyword(keyword);
        setActiveFilter(filtered);
    }


    return (
        <>
            {/*<div className={classes.visBox} onClick={showModal}>*/}
            {/*    { !isAddedVis ?*/}
            {/*        (*/}
            {/*           <div> <PlusCircleOutlined/>  Select Visualization </div>*/}
            {/*        )*/}
            {/*            :*/}
            {/*            (*/}
            {/*                <div>*/}
            {/*                    <NetVis key={editorId}*/}
            {/*                            visTypeList={visTypeList}*/}
            {/*                            network={network as string}*/}
            {/*                            options={options}/>*/}
            {/*                </div>*/}
            {/*        )*/}
            {/*    }*/}


            {/*</div>*/}
            <SearchBar keyword={keyword} onChange={updateKeyword}/>
            <div className={classes.visContainer}>
                <div className={classes.cards}>
                {activeFilter.sort(sortSession).map((session: Session) => {
                    //console.log("sessionStore" + JSON.stringify(sessionStore));
                    if (Array.isArray(session.vis)) {
                        session.vis = session.vis[0];
                    }

                    const images = session.vis.split('+').map((v) => find(templates, t => t.key === v)?.image) as string[]
                    return (
                        <div style={{overflow: 'hidden', clear: 'both'}} key={`editor${session.id}`}>
                            <VisBox
                                editorId={editorId}
                                editorType={editorType}
                                vis={session.vis}
                                network={session.network}
                                created={session.created}
                                img={images}
                                addToEd={addVisToEditor}
                            />
                        </div>
                    )
                })}
                </div>
            </div>

        </>
    );
};

export default VisModal;