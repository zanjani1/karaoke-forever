import React, { Component, PropTypes } from 'react'
import Slider from 'rc-slider'
import './VolumeSlider.scss'

export default class VolumeSlider extends Component {
  static propTypes = {
    volume: PropTypes.number.isRequired,
    offset: PropTypes.number,
    onVolumeChange: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  }

  state = {
    vol: this.props.volume,
    isDragging: false,
  }

  handleChange = this.handleChange.bind(this)
  handleAfterChange = this.handleAfterChange.bind(this)

  grabberStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    marginTop: '6px',
    fontSize: '48px',
    opacity: .7,
    color: '#333'
  }

  CustomGrabber = props => {
    const style = Object.assign({ left: `${props.offset}%` }, this.grabberStyle)
    let icon
    const vol = this.state.isDragging || this.ignoreStatus ? this.state.vol : this.props.volume
    const level = Math.round(vol * 10/3)

    switch (level) {
      case 0:
        icon = "volume_off"
        break;
      case 1:
        icon = "volume_mute"
        break;
      case 2:
        icon = "volume_down"
        break;
      default:
        icon = "volume_up"
    }

    return (
      <div style={style}>
        <i className='material-icons'>{icon}</i>
      </div>
    )
  }

  handleChange(vol) {
    this.setState({
      vol,
      isDragging: true,
    })
    this.props.onVolumeChange(vol)
    this.ignoreStatus = 0
  }

  handleAfterChange(vol) {
    this.setState({
      vol,
      isDragging: false,
    })
    this.props.onVolumeChange(vol)
    this.ignoreStatus = 2
  }

  componentDidUpdate(prevProps) {
    if (this.ignoreStatus && prevProps.volume !== this.props.volume) {
      this.ignoreStatus--
    }
  }

  render() {
    const CustomGrabber = this.CustomGrabber

    return (
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={this.state.isDragging || this.ignoreStatus ? this.state.vol : this.props.volume}
        onChange={this.handleChange}
        onAfterChange={this.handleAfterChange}
        handle={<CustomGrabber />}
        className={this.props.className}
      />
    )
  }
}
