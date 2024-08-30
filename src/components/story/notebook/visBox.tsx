import React, {FC} from "react";
import {Button} from "antd";
import {createUseStyles} from "react-jss";
import {Link} from "react-router-dom";

const useStyles = createUseStyles({
    card: {
        width: 130,
        margin: "25px 15px 2px 15px",
        display: 'flex',
        '&:hover $content': {
            cursor: 'pointer',
            borderColor: 'transparent',
            boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
        },
        '&:hover $func': {
            display: 'flex',
            flexDirection: 'column',
        }
    },
    content: {
        background: '#fff',
        boxShadow: '0px 0px 3px 0px #0000000D',
        borderRadius: 6,
        width: 142,
    },
    thumbnail: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px',
        border: '1px solid #f6f6f6',
        borderRadius: '6px 6px 0px 0px',
        width: 130,
        height: 116
    },
    visTitle: {
        fontWeight: 'bold',
        fontSize: '10px'
    },
    footer: {
        height: 25,
        width: 137,
        paddingLeft: 5,
        background: '#f6f6f6',
        // borderRadius: '0px 0px 6px 6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '5px',
    },
    func: {
        display: 'none',
    },
    footerBtn: {
        height: 30,
        width: 122,
        paddingLeft: 10,
        paddingRight: 10,
        background: '#f6f6f6',
        borderRadius: '0px 0px 6px 6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '5px',
    },
    btnFooter: {
        fontSize: '10px',
    },
})

interface VisBoxProps {
    vis: string,
    network: string,
    created: string,
    img: string[],
    editorId:number,
    editorType:string,
    addToEd: (editorId: number,editorType:string, vis: string, network: string, ) => void;
}

export const VisBox: FC<VisBoxProps> = function VisBox({created, img, network, editorId, vis, editorType, addToEd}) {
    const classes = useStyles();
    // let addedVis = false;
    const addVisToEditor = (id,vis,network,editorType) => {
        //alert("add vis="+vis+"    id="+id+"  NETWORK="+network+"   CREATED"+editorType);
        //handleClose();
        addToEd(editorId, vis, network, editorType);
    };


    return (
        <>
            <div className={classes.card}>
                <div className={classes.content}>
                    <Link
                        to={`/vis/${vis}/network/${network}`}
                        target='_blank'
                        style={{textDecoration: 'none', color: 'black'}}
                    >
                        <div className={classes.thumbnail}>
                            {img.map((imgs: string, index: number) => (
                                <img
                                    src={`./thumbnails/${imgs}`}
                                    key={index}
                                    style={{width: `${110 / img.length}px`}}/>
                            ))}
                        </div>
                    </Link>
                    <div className={classes.footer}>
                        <span className={classes.visTitle}>{network}</span>
                        <span style={{fontSize: 7, marginTop: '-3px'}}>{created}</span>
                    </div>

                    <div className={classes.footerBtn}>
                        <Button className={classes.btnFooter}
                                onClick={() => addVisToEditor(editorId,editorType, vis, network)}>Add</Button>
                    </div>

                </div>

            </div>
        </>


    );
};
