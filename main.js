miro.onReady(() => {
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'Calc',
        svgIcon:
          '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
        positionPriority: 1,
        onClick: async () => {
          const waitMoment = () => new Promise(r => setTimeout(r, 500))
          const calcFrames =  await miro.board.widgets.get({type: 'frame', title: 'Calc'})
          calcFrames.forEach(async(calcFrame) => {
            let estimationSum = 0
            let resultSum = 0

            calcFrame.childrenIds.forEach(async(id) => {
              const widget = (await miro.board.widgets.get({id: id}))[0]
              if (widget.type !== "SHAPE") {
                return
              }
              if (widget.plainText.slice(0,1) === 'e'){
                estimationSum += Number(widget.plainText.replace(/[^0-9^\.]/g,""))
              } else {
                resultSum += Number(widget.plainText.replace(/[^0-9^\.]/g,""))
              }
            });

            await waitMoment()
            const stickerText = `見積もり：${estimationSum}<br>実績：${resultSum}`
            let sticker = (await miro.board.widgets.create({type:'sticker'}))[0]
            await miro.board.widgets.update({id: sticker.id, text: stickerText,scale: 3, style:{stickerBackgroundColor:'#c9df56'}}) 
            await miro.board.widgets.transformDelta(sticker.id, calcFrame.bounds.left + 320 , calcFrame.bounds.top + 380)
          })
        },
      },
    },
  })
})
