miro.onReady(() => {
  const icon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><style>.cls-1,.cls-2{fill:none;}.cls-2{stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title>calc_24</title><g id="レイヤー_2" data-name="レイヤー 2"><g id="Rectangle"><rect class="cls-1" width="48" height="48"/></g><g id="icon_data"><rect class="cls-2" x="9" y="6" width="30" height="36"/><line class="cls-2" x1="9" y1="16" x2="33" y2="16"/><circle cx="17" cy="23" r="2"/><circle cx="24" cy="23" r="2"/><circle cx="31" cy="23" r="2"/><circle cx="17" cy="29" r="2"/><circle cx="24" cy="29" r="2"/><circle cx="31" cy="29" r="2"/><circle cx="17" cy="35" r="2"/><circle cx="24" cy="35" r="2"/><circle cx="31" cy="35" r="2"/></g></g></svg>'
  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'calc',
        svgIcon:
          icon,
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
