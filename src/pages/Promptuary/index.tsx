import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  StyledPromptuary,
  StyledContentPromptuary,
  StyledContentInfo,
  StyledAvatar,
  StyledButton,
} from './styles';

//GENERAL COMPONENTS
import TitlePage from '../../components/TitlePage';
import List from '../../components/List';
import ListTopic from '../../components/ListTopic';
import { PatientData, PatientInterface } from '../../utils/interfaces';
import Divider from '@material-ui/core/Divider';

import CircularProgress from '@material-ui/core/CircularProgress';
import ModalForm from '../../components/ModalForm';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import { getOne, getList, update } from '../../models/patient';

interface AlerInterface {
  message?: string;
  show: boolean;
  type: 'success' | 'error';
}

interface Params {
  idPatient?: string;
}

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Promptuary: React.FC = (): JSX.Element => {
  const params: Params = useParams();
  const history = useHistory();
  const [load, setLoad] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<any>({});
  const [openAlert, setOpenAlert] = useState<AlerInterface>({
    show: false,
    type: 'success',
  });

  const [patient, setPatient] = useState<PatientData>({
    name: '',
    cpfNumber: '',
    birthDate: '',
    gender: '',
  });

  const [patients, setPatients] = useState<PatientInterface[]>([]);

  const setList = async () => {
    const list = await getList();

    if (list) {
      setPatients(list);
    } else {
      console.error('Falha ao carregar listagem de pacientes');
    }

    setLoad(false);
  };

  const getPatient = async (patientId: string) => {
    const getPatient = await getOne(patientId);

    if (getPatient) {
      setPatient({ id: getPatient.patient_id, ...getPatient.patient_data });
    } else {
      console.error('Falha ao carregar paciente');
    }

    setLoad(false);
  };

  const updatePatient = async () => {
    let patientUpdated;

    if (patient.id) {
      patientUpdated = await update(patient.id, patient);
    }

    if (patientUpdated) {
      setOpenAlert({
        message: 'Paciente atualizado com sucesso',
        show: true,
        type: 'success',
      });
    } else {
      setOpenAlert({
        message: 'Falha ao atualizar paciente',
        show: true,
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (params.idPatient) {
      getPatient(params.idPatient);
    }

    setList();
  }, []);

  useEffect(() => {
    if (!patient.medications) setPatient({ ...patient, medications: [] });
    if (!patient.illnesses) setPatient({ ...patient, illnesses: [] });
    if (!patient.clinicalConsultations)
      setPatient({ ...patient, clinicalConsultations: [] });
  }, [patient]);

  if (load) {
    return (
      <StyledPromptuary>
        <div className="loading">
          <CircularProgress />
        </div>
      </StyledPromptuary>
    );
  } else if (!params.idPatient) {
    return (
      <StyledPromptuary>
        <TitlePage>Prontu??rio - Selecione o Paciente</TitlePage>

        <List
          items={patients}
          actions={{
            see: (patient: PatientInterface) => {
              setLoad(true);
              getPatient(patient.id);
              history.push(`/patients/promptuary/${patient.id}`);
            },
          }}
        />
      </StyledPromptuary>
    );
  }

  return (
    <StyledPromptuary>
      <StyledContentPromptuary>
        <TitlePage>Prontu??rio do Paciente</TitlePage>

        <Snackbar
          open={openAlert.show}
          autoHideDuration={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={openAlert.type}
            onClose={() => setOpenAlert({ ...openAlert, show: false })}
          >
            {openAlert.message}
          </Alert>
        </Snackbar>

        <StyledContentInfo>
          <div>
            <StyledAvatar alt={patient.name} src="./avatar" />
          </div>
          <div>
            <span>{patient.name}</span>
            <span>
              Documento n?? {patient.cpfNumber}, nascido(a) em{' '}
              {patient.birthDate}, g??nero {patient.gender}
            </span>
            <span>
              Tipo Sang??ineo {patient.bloodType || 'n??o cadastrado'}, peso{' '}
              {patient.weight || 'n??o cadastrado'}, altura{' '}
              {patient.heigth || 'n??o cadastrado'}
            </span>
            <span>
              Telefone {patient.phone || 'n??o cadastrado'}, endere??o{' '}
              {patient.address || 'n??o cadastrado'}
            </span>
          </div>

          <StyledButton
            onClick={() => {
              updatePatient();
            }}
          >
            Salvar Informa????es
          </StyledButton>

          <span className="spanInfo">
            Ap??s inserir informa????es de medicamentos, comordidades ou consultas
            m??dicas, lembre-se de registrar as informa????es clicando no bot??o
            salvar.
          </span>
        </StyledContentInfo>
        <Divider />

        <div className="subtitle">Medica????es</div>
        <ListTopic
          items={patient.medications || []}
          columns={['name', 'effect', 'date']}
        />
        <ModalForm
          submit={() => {
            patient.medications?.push(form);
            setForm({});
          }}
          cancel={() => {
            setForm({});
          }}
        >
          <div>
            <TextField
              label="Nome do Rem??dio"
              style={{ margin: 5 }}
              placeholder="Nome do Rem??dio"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Efeito do Rem??dio"
              style={{ margin: 5 }}
              placeholder="Efeito do Rem??dio"
              onChange={(e) => setForm({ ...form, effect: e.target.value })}
            />
            <TextField
              label="Data da Medica????o"
              style={{ margin: 5 }}
              placeholder="Data da Medica????o"
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
        </ModalForm>
        <Divider />

        <div className="subtitle">Comordidades/Doen??as</div>
        <ListTopic
          items={patient.illnesses || []}
          columns={['name', 'diagnosticDate', 'treatmentType']}
        />
        <ModalForm
          submit={() => {
            patient.illnesses?.push(form);
            setForm({});
          }}
          cancel={() => {
            setForm({});
          }}
        >
          <div>
            <TextField
              label="Nome da Doen??a"
              style={{ margin: 5 }}
              placeholder="Nome da Doen??a"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Data do Diagn??stico"
              style={{ margin: 5 }}
              placeholder="Data do Diagn??stico"
              onChange={(e) =>
                setForm({ ...form, diagnosticDate: e.target.value })
              }
            />
            <TextField
              label="Tipo de Tratamento"
              style={{ margin: 5 }}
              placeholder="Tipo de Tratamento"
              onChange={(e) =>
                setForm({ ...form, treatmentType: e.target.value })
              }
            />
          </div>
        </ModalForm>
        <Divider />

        <div className="subtitle">Consultas</div>
        <ListTopic
          items={patient.clinicalConsultations || []}
          columns={['type', 'date', 'diagnostic']}
        />
        <ModalForm
          submit={() => {
            patient.clinicalConsultations?.push(form);
            setForm({});
          }}
          cancel={() => {
            setForm({});
          }}
        >
          <div>
            <TextField
              label="Tipo da Consulta"
              style={{ margin: 5 }}
              placeholder="Tipo da Consulta"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <TextField
              label="Data da Consulta"
              style={{ margin: 5 }}
              placeholder="Data da Consulta"
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <TextField
              label="Diagn??stico da Consulta"
              style={{ margin: 5 }}
              placeholder="Diagn??stico da Consulta"
              onChange={(e) => setForm({ ...form, diagnostic: e.target.value })}
            />
          </div>
        </ModalForm>
      </StyledContentPromptuary>
    </StyledPromptuary>
  );
};

export default Promptuary;
