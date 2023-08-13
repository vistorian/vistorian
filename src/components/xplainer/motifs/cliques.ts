// @ts-nocheck

// import {Network} from "./netpan";
import Graph from "graphology";
import {Clique} from "./motif";

export function* findCliques(network: Graph) {
    let Q = [];
    let cand = network.nodes();

    let subg = JSON.parse(JSON.stringify(cand));
    let stack = []
    Q.push(null)

    let lengthArray = subg.map(n => cand.filter(n2 => network.neighbors(n).includes(n2)).length)
    let ind = lengthArray.indexOf(Math.max(...lengthArray))
    let u = subg[ind]

    let ext_u = cand.filter(n => !network.neighbors(u).includes(n))

    try {
        while (true) {
            if (ext_u.length > 0) {
                let q = ext_u.pop()
                cand = cand.filter(n => n != q);
                Q[Q.length - 1] = q
                let adj_q = network.neighbors(q)
                let subg_q = subg.filter(n => adj_q.includes(n))

                if (subg_q.length == 0) {
                    if (Q.length > 2) {
                        let clique = new Clique(Q);
                        yield clique;
                    }
                } else {
                    let cand_q = cand.filter(n => adj_q.includes(n))
                    if (cand_q) {
                        stack.push([subg, cand, ext_u])
                        Q.push(null)
                        subg = subg_q
                        cand = cand_q

                        // u = Math.max(...subg.map(n => cand.filter(n2 => network.neighbors(n).includes(n2)).length))
                        let lengthArray = subg.map(n => cand.filter(n2 => network.neighbors(n).includes(n2)).length)
                        let ind = lengthArray.indexOf(Math.max(...lengthArray))
                        u = subg[ind]

                        ext_u = cand.filter(n => !network.neighbors(u).includes(n))
                    }
                }
            } else {
                Q.pop();
                let shift = stack.pop();
                subg = shift[0];
                cand = shift[1];
                ext_u = shift[2];
            }
        }
    } catch (e) {
        // console.log(e)
    }
}