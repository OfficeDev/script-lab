import * as React from 'react'
import styled, { StyledComponentClass } from 'styled-components'

type Component = typeof React.Component | StyledComponentClass<any, any>

interface IProps {
  RenderHeader: Component
  RenderContent: Component
  RenderFooter: Component
}

const Layout = styled.div`
  height: 100vh;
  display: grid;

  grid-template-columns: auto;
  grid-template-rows: 44px auto 22px;
  grid-template-areas: 'header' 'content' 'footer';
`

const Section = ({ Component, area }) => (
  <Component style={{ gridArea: area }} />
)

const View: React.StatelessComponent<IProps> = ({
  RenderHeader,
  RenderContent,
  RenderFooter,
}) => (
  <Layout>
    <Section Component={RenderHeader} area="header" />
    <Section Component={RenderContent} area="content" />
    <Section Component={RenderFooter} area="footer" />
  </Layout>
)

export default View
