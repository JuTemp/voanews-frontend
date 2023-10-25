import { Button, Input, MenuProps, Space } from "antd"

type Item = { name: string, url: string };
type Items = { name: string, children: Items[] } | Item

export const defaultNavs = {
    key: 'Calendar||Regions||China News',
    url: 'https://www.voanews.com/z/6715',
}
export const navs: Items[] = [
    // name.match(/||/) must be false
    {
        name: 'Calendar',
        children: [
            {
                name: 'Regions',
                children: [
                    { name: "USA", url: "https://www.voanews.com/z/599" },
                    { name: "All About America", url: "https://www.voanews.com/z/5589" },
                    { name: "Immigration", url: "https://www.voanews.com/z/5362" },
                    { name: "Africa", url: "https://www.voanews.com/z/612" },
                    { name: "East Asia", url: "https://www.voanews.com/z/600" },
                    { name: "China News", url: "https://www.voanews.com/z/6715" },
                    { name: "South & Central Asia", url: "https://www.voanews.com/z/5452" },
                    { name: "Middle East", url: "https://www.voanews.com/z/598" },
                    { name: "VOA News on Iran", url: "https://www.voanews.com/z/5422" },
                    { name: "Europe", url: "https://www.voanews.com/z/611" },
                    { name: "Ukraine", url: "https://www.voanews.com/z/4047" },
                    { name: "Americas", url: "https://www.voanews.com/z/616" },
                ]
            },
            {
                name: 'Topics',
                children: [
                    { name: "Technology", url: "https://www.voanews.com/z/621" },
                    { name: "Economy", url: "https://www.voanews.com/z/605" },
                    { name: "Science & Health", url: "https://www.voanews.com/z/607" },
                    { name: "Climate Change", url: "https://www.voanews.com/z/6837" },
                    { name: "COVID-19 Pandemic", url: "https://www.voanews.com/z/6730" },
                    { name: "Arts & Culture", url: "https://www.voanews.com/z/602" },
                ]
            },
            {
                name: 'Others',
                children: [
                    { name: "Press Freedom", url: "https://www.voanews.com/z/5818" },
                    { name: "Day in Photos", url: "https://www.voanews.com/z/3413" },
                    { name: "Extremism Watch", url: "https://www.voanews.com/z/4885" },
                    { name: "Student Union", url: "https://www.voanews.com/z/5270" },
                    { name: "Fact Checks", url: "https://www.voanews.com/z/7515" },
                    { name: "Border Crossings", url: "https://www.voanews.com/z/3649" },
                    { name: "VOA Connect", url: "https://www.voanews.com/z/5302" },
                    { name: "Connect Full", url: "https://www.voanews.com/z/6801" },
                    { name: "Connect Segments", url: "https://www.voanews.com/z/6802" },
                    { name: "Connect Faith", url: "https://www.voanews.com/z/6772" },
                    { name: "The Inside Story", url: "https://www.voanews.com/z/6433" },
                    { name: "VOA TEK", url: "https://www.voanews.com/z/6831" },
                    { name: "Flashpoint Iran", url: "https://www.voanews.com/z/7290" },
                    { name: "Flashpoint Ukraine", url: "https://www.voanews.com/z/6932" },
                    { name: "International Edition", url: "https://www.voanews.com/z/7104" },
                    { name: "VOA1 - The Hits", url: "https://www.voanews.com/voa1-the-hits" },
                    { name: "VOA Newscasts", url: "https://www.voanews.com/z/1469" },
                    { name: "Issues in the News", url: "https://www.voanews.com/z/7550" },
                    { name: "Google Assistant", url: "https://www.voanews.com/z/5568" },
                    { name: "African Beat", url: "https://www.voanews.com/z/6738" },
                ]
            },
        ]
    },
    {
        name: 'News',
        children: [
            {
                name: 'United Status',
                children: [
                    { name: 'US News', url: 'https://www.voanews.com/usa', },
                    { name: 'All About America', url: 'https://www.voanews.com/all-about-america', },
                    { name: 'Silicon Valley & Technology', url: 'https://www.voanews.com/p/6290.html', },
                    { name: 'Immigration', url: 'https://www.voanews.com/immigration', },
                ]
            },
            {
                name: 'World',
                children: [
                    { name: 'Africa', url: 'https://www.voanews.com/africa' },
                    { name: 'The Americas', url: 'https://www.voanews.com/americas' },
                    { name: 'East Asia', url: 'https://www.voanews.com/east-asia' },
                    { name: 'Europe', url: 'https://www.voanews.com/europe' },
                    { name: 'Middle East', url: 'https://www.voanews.com/middle-east' },
                    { name: 'South & Central Asia', url: 'https://www.voanews.com/south-central-asia' },
                ]
            },
            { name: 'Ukraine', url: 'https://www.voanews.com/flashpoint' },
            { name: 'Covid-19 Pandemic', url: 'https://www.voanews.com/p/7783.html' },
            { name: 'VOA News on China', url: 'https://www.voanews.com/china' },
            { name: 'VOA News on Iran', url: 'https://www.voanews.com/iran' },
        ]
    },
    {
        name: 'Newscasts',
        url: 'https://www.voanews.com/z/1469',
    },
]

type parsedMenuPropsItems = { label: string, key: string, children?: parsedMenuPropsItems[] }

const parseItems = (items: Items[], keyPrefix: string = ''): parsedMenuPropsItems[] => {
    return items.map((item, index) => {
        if (!('children' in item))
            return {
                label: item.name,
                key: keyPrefix + item.name
            }
        else
            return {
                label: item.name,
                key: keyPrefix + item.name,
                children: (
                    parseItems(item.children, `${keyPrefix}${item.name}||`)
                )
            }
    })
}

export const navsMenuProps: MenuProps['items'] = parseItems(navs)

export const getUrl = (key: string) => {
    let items: Items[] = navs;
    let url: string = ''
    key.split('||').forEach((key, index) => {
        let item = items.find(item => item.name === key)!!
        if ('children' in item) items = item.children
        else url = item.url
    })
    return url
}

