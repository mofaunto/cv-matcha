'use client';

import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Group,
  Table,
  Button,
  Center,
  Loader,
} from '@mantine/core';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useDashboard } from '@/hooks/use-dashboard';
import { useCurrentUser } from '@/hooks/use-user';
import { usePositions } from '@/hooks/use-positions';
import { useCreateCV, useMyCVs } from '@/hooks/use-cvs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function FeedPage() {
  const { t } = useLanguage();
  const { data: dashboard, isLoading } = useDashboard();
  const { data: user } = useCurrentUser();
  const { data: positions } = usePositions();
  const { data: myCVs } = useMyCVs();
  const createCvMutation = useCreateCV();
  const router = useRouter();

  const role = user?.role;

  if (isLoading) return <Center><Loader color="teal" type="dots" /></Center>;

  return (
    <Container fluid>
      <Title order={2} mb="md">
        {t.feed.welcome}, {user?.name}
      </Title>

      {role === 'admin' && (
        <>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} mb="xl">
            {[
              [t.adminStats.totalPositions, dashboard?.stats.totalPositions],
              [t.adminStats.totalCandidates, dashboard?.stats.totalCandidates],
              [t.adminStats.totalRecruiters, dashboard?.stats.totalRecruiters],
              [t.adminStats.totalCVs, dashboard?.stats.totalCVs],
              [t.adminStats.newCVs24h, dashboard?.stats.cvsLast24h],
            ].map(([label, value]) => (
              <Card key={label} shadow="sm" padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed">{label}</Text>
                <Text fw={500} size="xl">{value ?? '-'}</Text>
              </Card>
            ))}
          </SimpleGrid>

          <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
            <Text fw={500} mb="sm">{t.dashboard.latestPositions}</Text>
            {dashboard?.latestPositions.length ? (
              <Table.ScrollContainer minWidth={400}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t.positions.title}</Table.Th>
                      <Table.Th>{t.dashboard.updated}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {dashboard.latestPositions.map(pos => (
                      <Table.Tr key={pos.id}>
                        <Table.Td>
                          <Text style={{ cursor: 'pointer' }} onClick={() => router.push('/positions')}>
                            {pos.title}
                          </Text>
                          <Text size="xs" c="dimmed">{pos.shortDescription}</Text>
                        </Table.Td>
                        <Table.Td>{new Date(pos.updatedAt).toLocaleDateString()}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            ) : (
              <Text c="dimmed">—</Text>
            )}
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
            <Text fw={500} mb="sm">{t.dashboard.popularPositions}</Text>
            {dashboard?.popularPositions.length ? (
              <Table.ScrollContainer minWidth={400}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t.positions.title}</Table.Th>
                      <Table.Th>CVs</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {dashboard.popularPositions.map(pos => (
                      <Table.Tr key={pos.id}>
                        <Table.Td>
                          <Text style={{ cursor: 'pointer' }} onClick={() => router.push('/positions')}>
                            {pos.title}
                          </Text>
                        </Table.Td>
                        <Table.Td>{pos.cvCount}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            ) : (
              <Text c="dimmed">—</Text>
            )}
          </Card>

          {dashboard?.tagCloud.length ? (
            <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
              <Text fw={500} mb="sm">{t.dashboard.trendingTags}</Text>
              <Group gap="xs">
                {dashboard.tagCloud.map(({ tag, count }) => (
                  <Badge
                    key={tag}
                    variant="light"
                    size="lg"
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/positions?tag=${tag}`)}
                  >
                    {tag} ({count})
                  </Badge>
                ))}
              </Group>
            </Card>
          ) : null}
        </>
      )}

      {role === 'candidate' && (
        <>
          <Text c="dimmed" mb="lg">{t.dashboard.candidateHint}</Text>
          <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
            <Text fw={500} mb="sm">{t.dashboard.availablePositions}</Text>
            {positions?.length ? (
              <Table.ScrollContainer minWidth={400}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t.positions.title}</Table.Th>
                      <Table.Th>{t.dashboard.tags}</Table.Th>
                      <Table.Th w={120}>{t.dashboard.action}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {positions.map(pos => (
                      <Table.Tr key={pos.id}>
                        <Table.Td>
                          <Text fw={500}>{pos.title}</Text>
                          <Text size="xs" c="dimmed">{pos.shortDescription}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {pos.projectTags?.map(tag => (
                              <Badge key={tag} size="sm" variant="light">{tag}</Badge>
                            ))}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Button
                            size="xs"
                            onClick={async () => {
                              try {
                                await createCvMutation.mutateAsync(pos.id);
                                toast.success(t.cvs.successCreate || 'CV created!');
                              } catch (err) {
                                toast.error(t.cvs.errorCreate || 'Failed to create CV.');
                              }
                            }}
                            loading={createCvMutation.isPending}
                          >
                            {t.dashboard.apply}
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            ) : (
              <Text c="dimmed">—</Text>
            )}
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text fw={500} mb="sm">{t.dashboard.yourCVs}</Text>
            {myCVs?.length ? (
              <Table.ScrollContainer minWidth={300}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t.cvs.position}</Table.Th>
                      <Table.Th>{t.cvs.created}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {myCVs.map(cv => (
                      <Table.Tr key={cv.id}>
                        <Table.Td>{cv.positionTitle}</Table.Td>
                        <Table.Td>{new Date(cv.createdAt).toLocaleDateString()}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            ) : (
              <Text c="dimmed">—</Text>
            )}
          </Card>
        </>
      )}

      {role === 'recruiter' && (
        <>
          <Text c="dimmed" mb="lg">{t.dashboard.recruiterHint}</Text>
          <Card shadow="sm" padding="md" radius="md" withBorder mb="xl">
            <Text fw={500} mb="sm">{t.dashboard.yourPositions}</Text>
            {positions?.length ? (
              <Table.ScrollContainer minWidth={400}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t.positions.title}</Table.Th>
                      <Table.Th>{t.dashboard.applicants}</Table.Th>
                      <Table.Th>{t.dashboard.tags}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {positions.map(pos => (
                      <Table.Tr key={pos.id}>
                        <Table.Td>
                          <Text fw={500}>{pos.title}</Text>
                          <Text size="xs" c="dimmed">{pos.shortDescription}</Text>
                        </Table.Td>
                        <Table.Td>{pos.candidateCount ?? 0}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            {pos.projectTags?.map(tag => (
                              <Badge key={tag} size="sm" variant="light">{tag}</Badge>
                            ))}
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            ) : (
              <Text c="dimmed">—</Text>
            )}
          </Card>
        </>
      )}
    </Container>
  );
}
