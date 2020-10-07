import React, {Component} from 'react';
import { Navbar, Form, FormControl,Container, Row, Col, Table, Button } from 'react-bootstrap';
import ModalPage from './ModalPage';

class Body extends Component {
	constructor(props){
		super(props);
		this.state={
			dataTable: [],
			valueSearch: '',
			inputNama: '',
			inputJabatan: '',
			inputJk: '',
			inputTl: '',
			inputId: ''
		}

		this.panggilSemua=this.panggilSemua.bind(this);
		this.hapusData=this.hapusData.bind(this);
		this.closeModal=this.closeModal.bind(this);
		this.handleInput=this.handleInput.bind(this);
		this.clearInput=this.clearInput.bind(this);
		this.simpanData=this.simpanData.bind(this);
		this.panggilById=this.panggilById.bind(this);
	}

	panggilById(id){
		fetch(`http://localhost:3000/data-karyawan/${id}`)
  			.then((response) => response.json())
  			.then((hasil => {
	  				this.props.setModalShow(true)
	  				this.setState(
		  				{
		  					inputNama: hasil.nama_karyawan,
							inputJabatan: hasil.jabatan,
							inputJk: hasil.jenis_kelamin,
							inputTl: hasil.tanggal_lahir,
							inputId: hasil.id
		  				}
		  			)
	  			}
  			))
	}

	simpanData(){
		if(this.state.inputNama === "" || this.state.inputJabatan === "" || this.state.inputJk === "" || this.state.inputTl === ""){
			alert("Silahkan isi data terlebih dahulu")
		} else if(this.state.inputId === ""){
			fetch('http://localhost:3000/data-karyawan',{
				method: 'POST',
				body: JSON.stringify({
					nama_karyawan: this.state.inputNama,
					jabatan: this.state.inputJabatan,
					jenis_kelamin: this.state.inputJk,
					tanggal_lahir: this.state.inputTl
				}),
				headers:{
					'Content-type': 'application/json; charset=UTF-8',
				},
			}).then((response) =>response.json())
			  .then((result =>{
				alert("Data Karyawan Telah Disimpan")
				this.closeModal()
				this.panggilSemua()
			}))
		}else{
				fetch(`http://localhost:3000/data-karyawan/${this.state.inputId}`,{
					method: 'PUT',
					body: JSON.stringify({
						nama_karyawan: this.state.inputNama,
						jabatan: this.state.inputJabatan,
						jenis_kelamin: this.state.inputJk,
						tanggal_lahir: this.state.inputTl
					}),
					headers:{
						'Content-type': 'application/json; charset=UTF-8',
					},
				}).then((response) =>response.json())
			  		.then((result =>{
			  		alert("Data Karyawan Telah Diperbaharui")
					this.panggilSemua()
					this.closeModal()					
			}))
		}
	}

	handleInput(value, e){
		this.setState({[value]: e.target.value})
	}


	closeModal(){
		this.props.setModalShow(false)
		this.clearInput()
	}

	clearInput(){
		this.setState({
			inputNama: '',
			inputJabatan: '',
			inputJk: '',
			inputTl: '',
			inputId: ''
		})
	}

	hapusData(id){
		fetch(`http://localhost:3000/data-karyawan/${id}`, {
			method: 'DELETE'
		}).then((response => {
			alert('Data Karyawan Sudah Terhapus')
			this.panggilSemua()
		}))
	}

	panggilSemua(){
		fetch('http://localhost:3000/data-karyawan')
		.then((response)=> response.json())
		.then((hasil)=> this.setState({dataTable: hasil}))
	}

	search(e){
        this.setState({valueSearch: e.target.value})
    }

	componentDidMount(){
		this.panggilSemua()
	}

	render(){
		return(
			<>
				<Navbar bg="light" variant="dark" sticky="top">
                    <Navbar.Brand style={{marginLeft: '115px',marginRight: '100px', color:'black'}}>APLIKASI PENGELOLAAN DATA KARYAWAN</Navbar.Brand>
                    <Form inline>
                        <FormControl style={{width:'500px'}} type="text" placeholder="Cari Data Karyawan" className="mr-sm-2" value={this.state.valueSearch} onChange={(e)=>this.search(e)} />
                        <Button onClick={()=>this.props.setModalShow(true)} variant="dark">Tambah Data</Button>
                    </Form>
                </Navbar>
				
				<Container>
					<ModalPage 
					modalShow={this.props.modalShow}
					setModalShow={this.props.setModalShow} 
					closeModal={this.closeModal}
					handleInput={this.handleInput}
					dataTable={this.state}
					simpanData={this.simpanData}
					/>
					<Row>
							<Col>
								<Table striped bordered hover responsive style={{textAlign: "center", marginTop:'2%'}}>
									  <thead>
									    <tr>
									      <th>Id</th>
									      <th>Nama Karyawan</th>
									      <th>Jabatan</th>
									      <th>Jenis Kelamin</th>
									      <th>Tanggal Lahir</th>
									      <th>Aksi</th>
									    </tr>
									  </thead>
									  <tbody>
									  {
									  	this.state.dataTable.reverse().filter(valueFilter => valueFilter.nama_karyawan.toLowerCase().includes(this.state.valueSearch.toLowerCase())).map((value, index)=>{
									  		return(
											    <tr key={index}>
											      <td>{value.id}</td>
											      <td>{value.nama_karyawan}</td>
											      <td>{value.jabatan}</td>
											      <td>{value.jenis_kelamin}</td>
											      <td>{value.tanggal_lahir}</td>
											      <td>
													  <Button onClick={()=> this.panggilById(value.id)} style={{marginRight: '5%'}} variant="success" size="sm">Edit</Button>
													  <Button onClick={()=> this.hapusData(value.id)} variant="danger" size="sm">Hapus</Button>
											      </td>
											    </tr>
											)    
										})
									}
									  </tbody>
								</Table>
							</Col>
				    </Row>
			    </Container>
			</>
		)
	}
}

export default Body;