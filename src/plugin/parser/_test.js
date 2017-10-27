function map(arr, handler) {
  const result = []
  for (let i = 0; i<arr.count(); i++) {
    result.push(handler(arr[i]))
  }
  return result
}

function parseNameAndQuery(inputName, getDefaultValues = () => {}) {
  const defaultValues = getDefaultValues()
  const result = { name: null, query: defaultValues }
  const name = String(inputName)
  if (name[0] !== '[') return result

  let state = 'none'
  let stack = ''

  for( let i = 0; i < name.length; i++) {
    const c = name[i]
    if (c === '[') {
      state = 'start'
    } else if (c === '?' || (state === 'start' && c === ']')) {
      result.name = stack
      stack = ''
      state = c === ']' ? 'end' : 'query'
    } else if (c === '&' || c === ']') {
      if (stack.length !== 0) {
        log("aaa")
        log(stack)
        const arr = stack.split('=')
        const queryName = arr[0]
        const queryValue = arr[1]

        const defaultValue = defaultValues[queryName]
        result.query[queryName] = typeof defaultValue === 'boolean' ?
          Boolean(queryValue) :
          typeof defaultValue === 'number' ?
            Number(queryValue) :
            queryValue
        stack = ''
      }
      state = c === '&' ? 'queryItem' : 'end'
    } else {
      stack = stack + c
    }
  }
  if (state !== 'end') throw new Error(`state not end ${state}`)
  return result
}

function BgImg(layerId) {
  return {
    _type: 'BgImg',
    layerId,
  }
}


function extractPositionStyle(layer) {

  const frame = layer.frame

  return {
    left : layer.container.sketchObject.absoluteRect().rulerX() - layer.sketchObject.absoluteRect().rulerX(),
    top: layer.container.sketchObject.absoluteRect().rulerY() - layer.sketchObject.absoluteRect().rulerX(),
  }
}

function toCSSRGBA(RGBAStr) {
  return 'rgba(' + String( RGBAStr ).replace(/[\(\)]/g,'').split(' ').map(function(v) {
    const [type, value] = v.split(":")
    if (type !== 'a') {
      return Math.round(Number(value) * 256)
    }
    return Number(value)
  }).join(',')+')'
}

function makeShadowCSS(shadow, inset){
  return `${inset ? 'inset ' : ''}${shadow.offsetX()}px ${shadow.offsetY()}px ${shadow.blurRadius()}px ${shadow.spread()}px ${toCSSRGBA(shadow.color())}`
}

function extractEffectStyle(layer) {
  const result = {}
  const fills = layer.sketchObject.style().fills()
  const borders = layer.sketchObject.style().borders()
  const shadows = layer.sketchObject.style().shadows()
  const innerShadows = layer.sketchObject.style().innerShadows()
  if (fills.count() > 0 ) {
    Object.assign(result, {
      background: map(fills, fill => {
        return toCSSRGBA(fill.color())
      }).join(',')
    })
  }

  if (borders.count() > 0) {
    const firstBorder = borders[0]
    Object.assign(result, {
      border: `${firstBorder.thickness()}px solid ${toCSSRGBA( firstBorder.color())}`
    })
  }

  if ((shadows.count() + innerShadows.count()) > 0) {
    const totalShadows = map(shadows, makeShadowCSS).concat(map(innerShadows, s => makeShadowCSS(s, true)))

    Object.assign(result, {
      boxShadow: totalShadows.join(',')
    })
  }

  return result
}

function extractBoxStyle(layer) {
  return {
    width: layer.frame.width,
    height: layer.frame.height
  }
}

function extractBoxRelatedStyle(layer) {
  return Object.assign(extractBoxStyle(layer), extractPositionStyle(layer))
}




const BG_NAME = 'Bg'

function getDefaultState() {
  return {
    style: {},
    center: false
  }
}

function _Group(group) {
  const next = []
  let bgLayer = null
  group.iterate((layer) => {
    // TODO 从节点上读数据
    // TODO Parse 直接写在名字上的配置
    if (parseNameAndQuery(layer.name).name === BG_NAME) {
      bgLayer = layer
    } else {
      next.push(layer)
    }
  })

  const { query } = parseNameAndQuery(group.name, getDefaultState)
  const node = {
    type: "Default",
    props: Object.assign(query, extractBoxRelatedStyle(group)),
  }

  if (bgLayer) {
    if (bgLayer.isImage || bgLayer.isGroup) {
      node.props.style.background = new BgImg(bgLayer.id)
    } else {
      // TODO 配置 style 上去
      Object.assign(node.props.style, extractEffectStyle(bgLayer))
    }
  }

  return [node, next]
}

let first
context.api().selectedDocument.selectedLayers.iterate(function (layer) {
  if (!first) first = layer
})

// _Group(first)
log(_Group(first)[0])
