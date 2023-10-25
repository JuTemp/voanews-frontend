import React, { createElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, FloatButton, Typography, message } from 'antd';
import { Loading } from '../loading/loading';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Desc.css';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

export const Desc: React.FC = () => {

  const [searchParams/* , setSearchParams */] = useSearchParams();
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const [Content, setContent] = useState<[string, string][]>([])
  const select = useRef<string | undefined>()
  const lastSelect = useRef<string | undefined>()

  const floatContainerRef = useRef<HTMLDivElement>(null)
  const floatButtonRef = useRef<HTMLButtonElement>(null)
  const [messageApi, contextHolder] = message.useMessage();

  const [mediaIsPlaying, setMediaIsPlaying] = useState<boolean>(false)

  const selectEventListener = useRef<(event: MouseEvent | TouchEvent | Event) => void>((event) => {
    select.current = document.getSelection()?.toString()
    if (document.getSelection()?.isCollapsed || select === lastSelect) {
      floatContainerRef.current?.classList.add('none')
      lastSelect.current = undefined
      return
    }
    lastSelect.current = select.current

    floatContainerRef.current?.classList.remove('none')
    let selectRect = document.getSelection()?.getRangeAt(0).getBoundingClientRect()
    let buttonRect = floatButtonRef.current?.getBoundingClientRect()
    floatContainerRef.current?.style?.setProperty('--t', `${selectRect?.top!! - buttonRect?.height!!}px`)
    floatContainerRef.current?.style?.setProperty('--l', `${(selectRect?.left!! + selectRect?.right!! - buttonRect?.width!!) / 2}px`)
  })

  useLayoutEffect(() => {

    fetch(`/api/desc?id=${id}`)
      .then((response) => response.json())
      .then(async (Content) => {
        document.title = `(${id}) - ${Content[0][1]}`
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', Content[0][1])
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${window.location.origin}/${id}`)
        setContent(Content)

        if (Content[2][0] === 'video') {
          // fetch Transcription
          const src = new DOMParser().parseFromString(Content[2][1], 'text/html').querySelector('source')!!.getAttribute('src')!!
          const url = atob(src.substring(src.lastIndexOf('=') + 1))
          const transcriptionUrl = `${window.location.origin}/api/transcribe/transcription?url=${btoa(url)}`
          const transcriptionStringArray: string[] = await (await fetch(transcriptionUrl)).json()
          setContent([...Content,
          ...transcriptionStringArray.map((item, index) => ['p', item])
          ])
        }
      })
  }, [id])

  useEffect(() => {
    if (!id) navigate('/main')

    floatContainerRef.current?.style?.setProperty('--t', '-100px')
    messageApi.info({ content: id, key: 'id' })

    if (selectEventListener.current) {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('mouseup', selectEventListener.current)
      // document.addEventListener('touchend', mouseUpEventListener.current)
      try {
        document.createEvent('TouchEvent'); // error -> pc  not error -> mobile
        document.addEventListener('selectionchange', selectEventListener.current)
      } catch (error) { }
      // document.addEventListener('selectionend', mouseUpEventListener.current)
    }
  }, [id, messageApi, navigate])

  const postTranslate = (words: string) => {
    fetch('/api/trans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        words,
      })
    })
      .then((response) => response.json())
      .then((results) => {
        const result = results['result']
        if (result.length === 3) messageApi.info(`${result[0]} -> [ ${result[1]} ]  ${result[2]}`)
        else messageApi.info(`${result[0]} -> [ ${result[1]} ]`)
      })
  }

  const playOrPause = () => {
    const media = document.querySelector('#media') as HTMLMediaElement
    if (media.paused) {
      setMediaIsPlaying(true)
      media.play()
    }
    else {
      setMediaIsPlaying(false)
      media.pause()
    }
  }

  return (
    <>
      <section className='container'>
        <Typography className='typography'>
          {Content.length === 0 ? <Loading /> :
            Content.map((item, index) => (
              createElement(item[0], {
                key: index,
                ...(item[0] === 'video' && {
                  id: 'media', controls: true, name: 'media', style: {
                    height: '50px', width: 'calc(100vw - 4vmin)', maxWidth: '1080px', marginTop: '1.2rem',
                  }
                }),
                className: 'content',
                dangerouslySetInnerHTML: {
                  __html: item[1]
                }
              })
            ))}
        </Typography>
      </section>
      <div>
        <FloatButton icon={!mediaIsPlaying ? <PlayCircleOutlined /> : <PauseCircleOutlined />} onClick={() => playOrPause()} />
      </div>
      <div id='floatContainer' className="none" ref={floatContainerRef} >
        <Button id='floatButton' ref={floatButtonRef} onClick={() => { if (select.current) postTranslate(select.current) }}>Trans</Button>
        {contextHolder}
      </div>
    </>
  )
}
