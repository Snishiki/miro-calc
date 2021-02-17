miro.onReady(() => {
  const icon =
    '<g id="Layer_1"><path d="M2.796,2.468 L2.749,22.468" fill-opacity="0" stroke="#000000" stroke-width="2"/><path d="M3.5,21.5 L23.564,21.5" fill-opacity="0" stroke="#000000" stroke-width="2"/><path d="M2.796,14.783 C3.209,13.972 3.594,13.171 4.059,12.371 C4.623,11.401 5.385,10.556 5.953,9.606 C6.402,8.857 7.01,8.19 7.426,7.395 C7.433,7.382 7.577,7.143 7.584,7.143 C7.752,7.143 8.14,9.507 8.163,9.606 C8.417,10.699 9.623,17.334 10.268,17.95 C10.54,18.21 10.69,17.331 10.846,16.995 C11.092,16.467 11.363,15.957 11.636,15.437 C12.745,13.317 13.466,11.153 14.687,9.053 C15.97,6.848 15.997,5.125 18.107,8.148 C18.173,8.244 19.421,9.809 19.475,9.757 C20.284,8.984 20.992,7.211 21.527,6.188" fill-opacity="0" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>'
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
