import React from "react";
import { Form, Input, Button, Modal, Col, Row } from 'antd';
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import {
    UserOutlined, LockOutlined, CloseCircleOutlined, EyeTwoTone, EyeInvisibleOutlined
} from '@ant-design/icons';
import 'antd/dist/reset.css'
import { authLogin } from "../app/Actions/auth";
import { PutForgotPassApi } from "../api/usersApi";
import { openNotificationWithIcon } from "./Function";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logoLogin from "../images/logo ITIIS.png"

const validateMessages = {
    required: 'Please enter your registered ${label} !',
    types: {
      email: '${label} is not in the correct email format!',
      number: '${label} not numbers!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  

class LoginForm extends React.Component {
    state = {
        username: "",
        password: "",
        loadings: false,
        modalVisibleRestPass: false,
      };
    
      onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    
      handleModalForgotPass = () => {
        // messageBox('warning', 'Thông báo', 'Chức năng đang phát triển')
        this.setState({
          modalVisibleRestPass: true,
        });
      };
    onFinishForgotPass = (values) => {
        this.setState({ loading: true })

        PutForgotPassApi({
            email: values.email
        }).then(res => {
            if (res.data.error) {
                const dataError = Object.entries(res.data.error).map(([key, value]) => <p>{value}</p>)
                openNotificationWithIcon('error', 'Lỗi', dataError)
                this.setState({ modalVisibleRestPass: false })

            }
            else {
                openNotificationWithIcon('success', 'Thông báo', 'Đăng ký đặt lại mật khẩu thành công. Vui lòng kiểm tra hộp thư')
                this.setState({ modalVisibleRestPass: true })
                // this.logout_new()
            }
            this.setState({ loading: false })
        })
            .catch(err => {
                console.log(err);
            });
    };

    handleModalCancel = () => {
        this.setState({ modalVisibleRestPass: false });
    };
    ForgotPass = (modalVisibleRestPass) => {

        return (
            <Modal
                destroyOnClose
                title="Reset your password"
                visible={modalVisibleRestPass}
                onCancel={this.handleModalCancel}
                footer={null}
                closeIcon={<CloseCircleOutlined title="Thoát (ESC)" />}
                keyboard // press esc to close
                style={{ width: '500px', "top": '250px' }}
            >
                <Form
                
                    onFinish={(values) => this.onFinishForgotPass(values)} validateMessages={validateMessages}
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }} 
                >
                    <Col sm={24} style={{marginBottom: "20px"}}> 
                        <Form.Item name='email'
                            rules={[{
                                required: true,
                                type: 'email'
                            },]}
                            label={"Email"}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Row>
                        <Col span={24} style={{ textAlign: "center" }}>
                            <Button shape="round" size="default" type="primary" htmlType="submit">Reset Password</Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    };

    render() {
        const { error, loading, token } = this.props;
        const { loadings } = this.state;
        if (token) {
            // localStorage.setItem("currentSelectedKeys", JSON.stringify(['2']))
            return (
                (<Redirect to="/home" />))
        }
        const onFinish = (values) => {
            this.props.login(values.username, values.password);
        };

        return (
            <div className="content">
                <div className="login">
                    <div className="logo-login">
                    {/* <img src={logoLogin} alt="" style={{ height: "60px" }}/> */}
                    <h1 style={{color: "#fff"}}>Đăng nhập</h1>
                    </div>
                    <div className="container loginFormInput">
                        <Form
                            style={{ paddingTop: '25px' }}
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                                username:'',
                                password:'Vbpo@2022',
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Username!',
                                    },
                                ]}
                                className="FormItem"
                            >
                                <Input className="inputPageLogin" prefix={<PersonIcon className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Password!',
                                    },
                                ]}
                                className="FormItem"
                                >
                                <Input.Password
                                    prefix={<LockIcon className="site-form-item-icon" />}
                                    className="inputPageLogin"
                                    placeholder="Password"
                                    iconRender={(visible) => (visible ? <VisibilityOff /> : <Visibility />)}
                                />
                            </Form.Item>
                            <Form.Item className="FormItem">
                                <Link to={"/forgot"} className="login-form-forgot" style={{ cursor: "pointer", color: "#0078d7" }}>Don't remember your password?</Link>
                                {/* <span onClick={() =>this.setState({ modalVisibleRestPass: true })} className="login-form-forgot " style={{ cursor: "pointer", color: "#0078d7" }}></span> */}
                            </Form.Item>
                            <Form.Item className="FormItem">
                                
                                <Button htmlType="submit" className="bn632-hover bn20" loading={loading} onClick={() => loadings}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                        {this.ForgotPass(this.state.modalVisibleRestPass)}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => dispatch(authLogin(username, password))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);