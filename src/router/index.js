import asLink from './as_link.js'
import {ListItem} from 'react-toolbox/lib/list'
import {Link} from 'react-toolbox/lib/link'
import {Button, IconButton} from 'react-toolbox/lib/button'


export const SimpleLink = asLink(Link)
export const ListItemLink = asLink(ListItem)
export const ButtonLins = asLink(Button)
export const IconButtonLink = asLink(IconButton)
