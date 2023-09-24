import Head from 'next/head'
import { useState } from 'react';

const Submit = () => {
  const [ saltActions, setSaltActions ] = useState([])
  const typesArr = [ "Salt", "Residents", "Other" ]

  const initState = () => {
    setSaltActions([{"Class": null, "Name": null, "Type": null}])
  }

  const getParent = (el: any) => {
    return document.querySelector(
      `[data-idx='${el.getAttribute("data-parent-idx")}']`+
      `[data-depth='${el.getAttribute("data-parent-depth")}']`+
      `[data-id='${el.getAttribute("data-parent-id")}']`)
  }

  const getId = () => {
    return Math.random().toString(36).substring(2,10)
  }

  const determineNestedType = (event: any, idx: number, depth: number, type: any) => {

    console.log(idx)

    if (type === "Salt") {
      setSaltActions((prevState) => {
        // ========== BACKTRACK ========== //      
        // --- Attempted do-while loop... ---
        // let curEl = event.target
        // const idxPath = []
        // do {
        //   let parent = getParent(curEl)
        //   idxPath.push(parent.getAttribute("data-idx"))
        //   curEl = parent
        // } while (curEl !== null)
  
        let curEl = getParent(event.target)
        const idxPath = []
        while (curEl !== null) {
          idxPath.push(curEl.getAttribute("data-idx"))
          curEl = getParent(curEl)
        }
  
        // ========== FORWARD TRAVERSAL ========== //
        // // A check that I wrote at work
        // if (depth > 0 && idxPath.length !== 1 && !Math.isNaN(idxPath[0])) { put logic below here }
        // while (curDepth > 0) {
        //   ptr = ptr[parentIndexes.shift()]["SaltActions"]
        //   curDepth -= 1
        // }
        // ptr[idx]["SaltActions"] = [ {"Class": null, "Name": null, "Type": null} ]
  
        let ptr = prevState
        if (idxPath.length !== 0) {
          let curDepth = depth
          while (curDepth > 0) {
            ptr = ptr[idxPath.shift()]["SaltActions"]
            curDepth -= 1
          }
        }
        
        ptr[idx]["SaltActions"] = [ {"Class": null, "Name": null, "Type": null} ]
  
        return [...prevState]
      })
    }
  }

  const addSaltAction = (event: any, idx: number, depth: number) => {
    setSaltActions((prevState) => {
      // TODO: Consider abstracting the backtracking and forward
      //       traversal procedures into a reusable entity
      // ========== BACKTRACK ========== //
      let curEl = getParent(event.target)
      const idxPath = []
      while (curEl !== null) {
        idxPath.push(curEl.getAttribute("data-idx"))
        curEl = getParent(curEl)
      }

      // ========== FORWARD TRAVERSAL ========== //
      let ptr = prevState
      if (idxPath.length !== 0) {
        let curDepth = depth
        while (curDepth > 1) {
          ptr = ptr[idxPath.shift()]["SaltActions"]
          curDepth -= 1
        }
      }

      // ptr will just point to the element that was clicked...
      // - I want to stop at the parent
      // - idx will refer to the current element...
      // - Use the indexes in idxPath...the remaining element
      //    in idxPath is probably the one you need
      // - Stop at the depth before...
      
      if (idxPath.length === 0) {
        // TODO: Understand why does prevState= work but ptr= doesn't...?
        prevState = [ ...ptr, {"Class": null, "Name": null, "Type": null} ]
      } else {
        const targIdx = idxPath.shift()
        ptr[targIdx]["SaltActions"] = [ ...ptr[targIdx]["SaltActions"],
                                        {"Class": null, "Name": null, "Type": null} ]
      }

      return [ ...prevState ]
    })
  }

  const renderSaltActions = (fields: any, saltActions: any, idx: number, depth: number, id: any) => {
    // THINK: idx and depth would belong to a parent one depth above
    saltActions.map((item: any, i: number) => {
      const curId = getId()
      fields.push(
        // -----  A fieldset ----- //
        // TODO: Separate the commonality b/w the addSalt button and radio button below
        //       - You can consider moving all of those data-* attributes into some top-level div.
        //         After all, all you're really concerned about is location...not actual elements.
        <div style={ { "marginLeft": 5+(10*depth) } }
             key={i+String(idx)+String(depth)}>
          {/* ----- Add salt action button ----- */}
          {/* TODO: UI can crash in the following case:
            - Add a 2nd salt action item   
            - Keep adding nested salt action items on that 2nd one until UI crashes */}
          {/* TODO: Add a remove button next to each individual salt action item */}
          { depth === 0 || (depth > 0 && i === 0) ? <span style={ { "marginRight": "10px"} }>
                          <input data-parent-idx={idx}
                                 data-parent-depth={depth-1}
                                 data-idx={i} data-depth={depth}
                                 data-parent-id={id} data-id={curId}
                                 type="button" value="+"
                                 onClick={(event)=> addSaltAction(event, i, depth)}/>
                        </span> : <></> }
          {/* // ----- The radio buttons within the fieldset ----- // */}
          <label>Type: </label>
          { typesArr.map((type: any, j: number) => {
            return (
              <span key={j+String(idx)+String(depth)}>
                <label>{ type }</label>
                <input data-parent-idx={idx}
                       data-parent-depth={depth-1}
                       data-idx={i} data-depth={depth}
                       data-parent-id={id} data-id={curId}
                       name={ "type_"+String(idx)+String(depth)+curId } type="radio"
                       onClick={(event) => determineNestedType(event, i, depth, type) }/>
              </span>
            )
          }) }
        </div>
      )
      if ("SaltActions" in item) {
        renderSaltActions(fields, item["SaltActions"], i, depth+1, curId)
      }
    })
    return fields
  }

  return (
    <>
      <Head>
        <title>List | About</title>
        <meta name="keywords" content="ninjas"/>
      </Head>
      <div>
        <input type="button" value="CLICK HERE" onClick={() => initState()}/>

        <div>
          { renderSaltActions([], saltActions, 0, 0, getId()) }
        </div>

        { void console.log("saltActions is: ", saltActions) }

      </div>  
    </>
  );
}
 
export default Submit;