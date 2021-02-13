miro.onReady(() => {
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'calc',
        svgIcon:
          '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
        positionPriority: 1,
        onClick: async () => {
          const calcFrames =  await miro.board.widgets.get({type: 'frame', title: 'Calc'})
          for(let calcFrame of calcFrames) {
            let estimationSum = 0
            let resultSum = 0
            const calcAllChildren = async () => {
              await Promise.all(calcFrame.childrenIds.map(async id => {
                const widget = (await miro.board.widgets.get({id: id}))[0]
                if (widget.type !== "SHAPE") {
                  return
                }
                if (widget.plainText.slice(0,1) === 'e'){
                  estimationSum += Number(widget.plainText.replace(/[^0-9^\.]/g,""))
                } else {
                  resultSum += Number(widget.plainText.replace(/[^0-9^\.]/g,""))
                }
              }))
              const stickerText = `見積もり：${estimationSum}<br>実績：${resultSum}`
              let sticker = (await miro.board.widgets.create({type:'sticker'}))[0]
              await miro.board.widgets.update({id: sticker.id, text: stickerText,scale: 3, style:{stickerBackgroundColor:'#c9df56'}}) 
              await miro.board.widgets.transformDelta(sticker.id, calcFrame.bounds.left + 320 , calcFrame.bounds.top + 380)
            };
            calcAllChildren()
          }
        },
      },
    },
  })
})
