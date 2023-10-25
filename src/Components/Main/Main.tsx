import React, { useLayoutEffect, useState } from 'react';
import { Input, Menu, Typography } from 'antd';
import Logo from '../../assets/img/logo.jpg'
import './Main.css'
import { Loading } from '../loading/loading';
import { Link, useNavigate } from 'react-router-dom';
import { defaultNavs, getUrl, navsMenuProps } from '../navs';
import { MenuInfo } from 'rc-menu/lib/interface';

export const Main: React.FC = () => {

  const [NavKeySelected, setNavKeySelected] = useState<string>(defaultNavs.key)
  const [Content, setContent] = useState<[...{ title: string, id: string }[]]>([])

  const navigate = useNavigate();

  useLayoutEffect(() => postToday(), []);

  const postToday = (url?: string) => {
    fetch('/api/today', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // url: document.cookie.split('&').find(/id/)
        // url: 'https://www.voanews.com/china', // cookie
        url: url || defaultNavs.url,
      }),
    }) // nodejs https://www.voanews.com/api/zmjuqteb_kqo
      .then((response) => response.json())
      .then((Content) => setContent(Content))
  }

  const click = (event: MenuInfo) => {
    if (event.key === 'Input') return
    setNavKeySelected(event.key)
    postToday(getUrl(event.key))
  }

  const search = (id:string) =>{
    navigate(`/desc?id=${id}`)
  }

  return (
    <>
      <nav>
        <img src={Logo} alt='Logo' style={{ height: '50px', width: '50px', margin: '0px 20px', display: 'inline' }} />
        <Menu mode='horizontal' style={{ fontSize: '1.5rem', fontFamily: 'Ubuntu-Regular', backgroundColor: '#E0FFFF', width: 'calc(100vw - 90px)' }}
          items={navsMenuProps?.concat([
            {
                label: <Input placeholder="Input Id" bordered={false} style={{caretColor: 'auto'}}
                            onPressEnter={(event)=>{search((event.target as HTMLInputElement).value)}}/>,
                key: 'Input'
            }
        ])} 
          onClick={(event) => click(event)} selectedKeys={[NavKeySelected]} />
      </nav>
      <section className="container" style={{ maxWidth: '1080px', margin: 'auto', height: 'calc(100vh - 4vmin - 50px)', width: '90vw' }}>
        <article>
          <Typography className='typography'>
            {Content.length === 0 ? <Loading /> :
              Content.map((item, index) => (
                <Typography.Title key={index} level={4} >
                  <Link to={`/desc?id=${item.id}`} style={{ fontSize: '1.5rem' }}>{item.title}</Link>
                </Typography.Title>
              ))
            }
          </Typography>
        </article>
      </section>
    </>
  );
}
