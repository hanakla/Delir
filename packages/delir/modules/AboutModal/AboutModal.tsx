import * as React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

import Button from '../../components/Button'
import Link from '../../components/Link'
import ModalWindow from '../ModalWindow/Controller'

import * as packageJson from '../../../../package.json'
import * as corePackageJSON from '../../../delir-core/package.json'
import { dependencies } from './Licenses'

import t from './AboutModal.i18n'
import * as s from './AboutModal.styl'

export const show = (): void => {
    const modal = new ModalWindow({closable: true})

    const onClosed = async () => {
        await modal.hide()
        modal.dispose()
    }

    modal.mount(<AboutModal onClosed={onClosed} />)
    setTimeout(() => modal.show(), 1000)
}

const AboutModal = (props: {onClosed: () => void}) => {
    return (
        <div className={s.AboutModal}>
            <Tabs>
                <TabList className={s.tabList}>
                    <Tab className={s.tab} selectedClassName={s.tabSelected}>About</Tab>
                    <Tab className={s.tab} selectedClassName={s.tabSelected}>Licenses</Tab>
                </TabList>
                <TabPanel>
                    <h1>Delir<small>{packageJson.version}</small></h1>
                    <dl>
                        <dt>Contact</dt>
                        <dd><Link href='https://twitter.com/@DelirVFX'>Twitter: @DelirVFX</Link></dd>

                        <dt>GitHub</dt>
                        <dd><Link href='https://github.com/ra-gg/Delir'>https://github.com/ra-gg/Delir</Link></dd>

                        <dt>Discord</dt>
                        <dd><Link href='https://discord.gg/rrr2z2E'>DelirVFX</Link></dd>

                        <dt>Runtime</dt>
                        <dd>
                            Electron: {process.versions.electron} / Node.js: {process.versions.node}<br />
                            delir-core: {corePackageJSON.version}
                        </dd>
                    </dl>
                </TabPanel>
                <TabPanel>
                    <div className={s.licensesTitle}>{t('licenses.title')}</div>
                    <div className={s.licenseContainer}>
                        <div className={s.licenseList}>
                            {dependencies.map(({name, url}) => (
                                <Link className={s.licenseLink} href={url}>{name}</Link>
                            ))}
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
            <Button type='normal' className={s.close} onClick={props.onClosed}>{t('close')}</Button>
        </div>
    )
}
